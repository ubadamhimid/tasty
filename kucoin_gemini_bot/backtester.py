import os
import sys
import json
import logging
import time
from dotenv import load_dotenv
import pandas as pd
import numpy as np
import ccxt
from google import genai
from google.genai import types

# Import SMC strategy context rules
from strategy_context import STRATEGY_CONTEXT

# Setup Logging for Backtester
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler("backtest.log", mode="w", encoding="utf-8")
    ]
)
logger = logging.getLogger("SMCBacktester")

# Load configuration
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash")
TRADING_SYMBOL = os.getenv("TRADING_SYMBOL", "BTC/USDT")
TRADING_SYMBOLS = os.getenv("TRADING_SYMBOLS", TRADING_SYMBOL)
TIMEFRAME = os.getenv("TIMEFRAME", "1h")

try:
    MAX_CONCURRENT_TRADES = max(1, int(os.getenv("MAX_CONCURRENT_TRADES", "1")))
except ValueError:
    MAX_CONCURRENT_TRADES = 1

try:
    INITIAL_CAPITAL = max(100.0, float(os.getenv("INITIAL_CAPITAL", "1000.0")))
except ValueError:
    INITIAL_CAPITAL = 1000.0

try:
    RISK_PER_TRADE = max(0.25, min(2.0, float(os.getenv("RISK_PER_TRADE", "2.0"))))
except ValueError:
    RISK_PER_TRADE = 2.0

try:
    TARGET_RRR = max(2.0, float(os.getenv("TARGET_RRR", "5.0")))
except ValueError:
    TARGET_RRR = 5.0

try:
    MIN_SL_DIST_PCT = max(0.1, float(os.getenv("MIN_SL_DIST_PCT", "0.5"))) / 100.0
except ValueError:
    MIN_SL_DIST_PCT = 0.005

try:
    BACKTEST_YEARS = max(1, int(os.getenv("BACKTEST_YEARS", "1")))
except ValueError:
    BACKTEST_YEARS = 1

SKIP_GEMINI_CONFIRMATION = os.getenv("SKIP_GEMINI_CONFIRMATION", "False").lower() == "true"

# Check API Key
def is_placeholder(val):
    return not val or "your_" in val.lower() or val == ""

if is_placeholder(GEMINI_API_KEY):
    logger.error("GEMINI_API_KEY is not configured in .env. Please configure it to run the backtester.")
    sys.exit(1)

# Initialize clients
logger.info("Initializing clients...")
client = genai.Client(api_key=GEMINI_API_KEY)
exchange = ccxt.kucoin({'enableRateLimit': True})


def calculate_rsi_series(df, period=14):
    if len(df) < period:
        return pd.Series(50.0, index=df.index)
    delta = df['close'].diff()
    gain = delta.where(delta > 0, 0.0)
    loss = -delta.where(delta < 0, 0.0)
    avg_gain = gain.ewm(com=period - 1, adjust=False).mean()
    avg_loss = loss.ewm(com=period - 1, adjust=False).mean()
    rs = avg_gain / avg_loss.replace(0.0, 0.0001)
    rsi = 100 - (100 / (1 + rs))
    return rsi

# --- STRATEGY HELPER FUNCTIONS FROM MANIFESTO ---

def get_structure_levels_with_rsi_np(highs, lows, idx):
    """
    Finds the most recent completed swing high and swing low in the slice ending at idx
    (excluding the last candle) and returns their values and main array integer indices.
    """
    last_high = None
    last_high_idx = None
    last_low = None
    last_low_idx = None
    
    start_idx = idx - 40
    if start_idx < 0:
        start_idx = 0
        
    for j in range(idx - 3, start_idx + 1, -1):
        if j >= 2:
            if (highs[j] >= highs[j-1] and highs[j] >= highs[j-2] and
                highs[j] >= highs[j+1] and highs[j] >= highs[j+2]):
                last_high = highs[j]
                last_high_idx = j
                break
                
    for j in range(idx - 3, start_idx + 1, -1):
        if j >= 2:
            if (lows[j] <= lows[j-1] and lows[j] <= lows[j-2] and
                lows[j] <= lows[j+1] and lows[j] <= lows[j+2]):
                last_low = lows[j]
                last_low_idx = j
                break
                
    # Fallbacks if no swing points identified in the slice
    if last_high is None:
        last_high = np.max(highs[start_idx:idx-1]) if idx-1 > start_idx else 0.0
        last_high_idx = np.argmax(highs[start_idx:idx-1]) + start_idx if idx-1 > start_idx else 0
    if last_low is None:
        last_low = np.min(lows[start_idx:idx-1]) if idx-1 > start_idx else 0.0
        last_low_idx = np.argmin(lows[start_idx:idx-1]) + start_idx if idx-1 > start_idx else 0
        
    return last_high, last_high_idx, last_low, last_low_idx


def detect_structure_break_np(highs, lows, closes, idx, last_high, last_low):
    """
    Analyzes price structure using numpy to identify real BOS/CHOCH 
    vs. Liquidity Sweeps based on candle body close, ensuring triggers 
    only occur on the initial cross event (crossing high/low).
    """
    if idx < 5:
        return "No Structural Change"
        
    current_close = closes[idx-1]
    current_high = highs[idx-1]
    current_low = lows[idx-1]
    
    prev_close = closes[idx-2]
    prev_high = highs[idx-2]
    prev_low = lows[idx-2]

    # Bullish structures (crossing above swing high)
    if current_close > last_high and prev_close <= last_high:
        return "BOS/CHOCH - Confirmed (Body Close)"
    elif current_high > last_high and prev_high <= last_high:
        return "Liquidity Sweep - Wick Only (Potential Transfer)"
    
    # Bearish structures (crossing below swing low)
    if current_close < last_low and prev_close >= last_low:
        return "BOS/CHOCH - Confirmed (Body Close)"
    elif current_low < last_low and prev_low >= last_low:
        return "Liquidity Sweep - Wick Only (Potential Transfer)"
        
    return "No Structural Change"


def get_htf_timeframe(ltf):
    if ltf == "5m":
        return "1h"
    elif ltf == "15m":
        return "1h"
    elif ltf == "1h":
        return "4h"
    else:
        return "4h"


def precalculate_htf_trends(htf_df):
    """
    Pre-calculates the HTF trend bias for each candle in htf_df sequentially,
    ensuring no lookahead bias.
    """
    n = len(htf_df)
    trends = ['NEUTRAL'] * n
    if n < 5:
        return trends
        
    swing_highs = []
    swing_lows = []
    current_trend = 'NEUTRAL'
    
    highs = htf_df['high'].values
    lows = htf_df['low'].values
    closes = htf_df['close'].values
    
    for i in range(2, n):
        # We can confirm a swing high/low at index i-2 since we have candles i-1 and i to complete it
        if i - 4 >= 0:
            idx = i - 2
            # Swing High
            if (highs[idx] >= highs[idx-1] and highs[idx] >= highs[idx-2] and
                highs[idx] >= highs[idx+1] and highs[idx] >= highs[idx+2]):
                swing_highs.append(highs[idx])
            # Swing Low
            if (lows[idx] <= lows[idx-1] and lows[idx] <= lows[idx-2] and
                lows[idx] <= lows[idx+1] and lows[idx] <= lows[idx+2]):
                swing_lows.append(lows[idx])
                
        # Check for break of structural swing levels
        if swing_highs:
            if closes[i] > swing_highs[-1]:
                current_trend = 'BULLISH'
        if swing_lows:
            if closes[i] < swing_lows[-1]:
                current_trend = 'BEARISH'
                
        trends[i] = current_trend
        
    return trends


def find_high_prob_ob_np(highs, lows, idx):
    """
    Filters high-probability Order Blocks by checking for strict triple constraint:
    1. Liquidity Capture: Wick swept previous candle's low (for bullish) or high (for bearish).
    2. FVG Generation: Left an immediate Fair Value Gap between candle (i-1) and candle (i+1).
    3. Currently Unmitigated: No subsequent candle's wick has touched/penetrated the OB zone (from i+2 to the current candle).
    """
    ob_zones = []
    start_idx = max(1, idx - 40)
    for i in range(start_idx, idx - 2):
        # Bullish OB Check
        swept_liquidity_bull = lows[i] < lows[i-1]
        has_bullish_fvg = lows[i+2] > highs[i]
        
        if swept_liquidity_bull and has_bullish_fvg:
            # Check for mitigation: did any subsequent price retrace and touch this zone?
            mitigated = False
            for j in range(i + 3, idx):
                if lows[j] <= highs[i]:
                    mitigated = True
                    break
            if not mitigated:
                ob_zones.append({
                    'entry': highs[i],
                    'sl': lows[i],
                    'type': 'Strong Bullish OB',
                    'candle_index': i
                })

        # Bearish OB Check
        swept_liquidity_bear = highs[i] > highs[i-1]
        has_bearish_fvg = highs[i+2] < lows[i]
        
        if swept_liquidity_bear and has_bearish_fvg:
            # Check for mitigation: did any subsequent price retrace and touch this zone?
            mitigated = False
            for j in range(i + 3, idx):
                if highs[j] >= lows[i]:
                    mitigated = True
                    break
            if not mitigated:
                ob_zones.append({
                    'entry': lows[i],
                    'sl': highs[i],
                    'type': 'Strong Bearish OB',
                    'candle_index': i
                })
            
    return ob_zones


def crypto_position_calculator(balance, risk_pct, entry, stop_loss, leverage=1):
    """
    Calculates the exact trade quantity based on capital, risk parameters,
    and structural invalidation levels under spot constraints (no leverage).
    """
    # Risk percentage bound for spot trading
    risk_pct = max(0.25, min(2.0, risk_pct))
    risk_usd = balance * (risk_pct / 100)
    sl_dist_pct = abs(entry - stop_loss) / entry
    
    if sl_dist_pct == 0:
        sl_dist_pct = 0.0001
        
    position_size_usd = risk_usd / sl_dist_pct
    
    # Enforce Spot constraint: position size cannot exceed 95% of balance
    max_spot_size = balance * 0.95
    if position_size_usd > max_spot_size:
        position_size_usd = max_spot_size
        
    # Re-calculate actual risk based on the capped position size
    actual_risk_usd = position_size_usd * sl_dist_pct
    
    return {
        "Position Size ($)": position_size_usd,
        "Risk Amount ($)": actual_risk_usd,
        "Leverage Recommended": 1,
        "Max Loss Warning": "Stops below structural low",
        "position_size_usd": position_size_usd,
        "risk_amount_usd": actual_risk_usd
    }


# --- BACKTEST CORE LOGIC WITH PAGINATION ---

def fetch_historical_data_multiyear(symbol, timeframe, years=1):
    """
    Fetches historical candles dynamically using CCXT pagination for a specified number of years.
    Caches the results locally to avoid KuCoin API rate limiting.
    """
    cache_filename = f"{symbol.replace('/', '_').lower()}_{timeframe}_{years}y_cache.csv"
    if os.path.exists(cache_filename):
        logger.info(f"Loading cached historical data from {cache_filename}...")
        df = pd.read_csv(cache_filename)
        df['datetime'] = pd.to_datetime(df['datetime'])
        return df

    try:
        logger.info(f"Initializing {years}-year historical data download for {symbol} ({timeframe})...")
        multi_year_ms = years * 365 * 24 * 60 * 60 * 1000
        since = exchange.milliseconds() - multi_year_ms
        
        all_candles = []
        limit_chunk = 1000  # Fetch size per query
        
        while True:
            logger.info(f"Fetching chunk starting from: {pd.to_datetime(since, unit='ms')}...")
            
            # Fetch with rate limit retry
            candles = None
            for attempt in range(5):
                try:
                    candles = exchange.fetch_ohlcv(symbol, timeframe, since=since, limit=limit_chunk)
                    break
                except Exception as ex:
                    logger.warning(f"Error fetching chunk: {ex}. Retrying in {(attempt+1)*5}s...")
                    time.sleep((attempt+1)*5)
            
            if candles is None:
                logger.error("Failed to fetch chunk after multiple retries. Aborting fetch.")
                break
                
            if not candles:
                logger.info("No more candles returned from API. Fetching completed.")
                break
                
            all_candles.extend(candles)
            
            # Progress start marker
            new_since = candles[-1][0] + 1
            
            if new_since <= since:
                # In case timestamp doesn't advance
                break
                
            since = new_since
            time.sleep(2.0)  # Rest to avoid KuCoin API limits
            
            # Break if we've reached near current time (within 1 timeframe interval)
            timeframe_ms = exchange.parse_timeframe(timeframe) * 1000
            if since >= exchange.milliseconds() - timeframe_ms:
                break
                
        # Load into Pandas and clean/deduplicate
        df = pd.DataFrame(all_candles, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
        df = df.drop_duplicates(subset=['timestamp']).sort_values('timestamp').reset_index(drop=True)
        df['datetime'] = pd.to_datetime(df['timestamp'], unit='ms')
        df = df[['datetime', 'open', 'high', 'low', 'close', 'volume']]
        
        # Save cache
        logger.info(f"Caching historical data to {cache_filename}...")
        df.to_csv(cache_filename, index=False)
        
        return df
    except Exception as e:
        logger.error(f"Error compiling paginated historical data: {e}")
        return None

# Format candle segment for Gemini
def format_candles(df_slice):
    temp_df = df_slice.copy()
    temp_df['datetime'] = temp_df['datetime'].dt.strftime('%Y-%m-%d %H:%M')
    table_str = temp_df.to_string(index=False, formatters={
        'open': '{:,.2f}'.format,
        'high': '{:,.2f}'.format,
        'low': '{:,.2f}'.format,
        'close': '{:,.2f}'.format,
        'volume': '{:,.4f}'.format,
        'rsi': '{:,.2f}'.format
    })
    return table_str

# Query Gemini model with exponential backoff on 429/ResourceExhausted errors
def query_model(symbol, market_data_str, structure_status, ob_zones, size_suggestions, suggested_setup, htf_trend):
    ob_str = json.dumps(ob_zones[-3:], default=str, indent=2) if ob_zones else "None"
    
    prompt = f"""
{STRATEGY_CONTEXT}

Here is the recent market OHLCV candle data for {symbol} on the {TIMEFRAME} timeframe:

```
{market_data_str}
```

--- PRE-COMPUTED LOCAL INDICATORS ---
Market Structure Break Status: {structure_status}
HTF Trend Bias: {htf_trend}
Strong Order Block Zones Found (POI) (Last 3):
{ob_str}
Suggested Account Position Configuration (based on current price):
{json.dumps(size_suggestions, indent=2)}

--- PYTHON CALCULATED SETUP LEVELS ---
Directional Setup: {suggested_setup['direction']}
Suggested Entry: {suggested_setup['entry']:,.2f}
Suggested Stop Loss (SL): {suggested_setup['sl']:,.2f} (Strictly outside OB/Sweep wick with 0.05% buffer)
Suggested Take Profit (TP): {suggested_setup['tp']:,.2f} (Precisely 1:{TARGET_RRR} Risk-to-Reward Ratio)

Evaluate this data and the suggested setup. Confirm if this is a high-probability institutional trade opportunity.
Use the provided RSI values as context to spot momentum shifts and divergences naturally, but prioritize structural unmitigated Order Blocks, Fair Value Gaps (FVG), and Session Liquidity Sweeps as your core directional trigger.
Your only job is to act as a directional filter. Decide whether to confirm the setup (BUY/SELL) or filter it out (HOLD).
Do not guess or try to calculate price levels. Simply output your decision in the JSON format requested.
"""
    max_retries = 5
    backoff_seconds = 5
    
    for attempt in range(max_retries):
        try:
            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema={
                        "type": "OBJECT",
                        "properties": {
                            "action": {
                                "type": "STRING",
                                "enum": ["BUY", "SELL", "HOLD"],
                                "description": "The trade recommendation action."
                            },
                            "reasoning": {
                                "type": "STRING",
                                "description": "Brief structural reasoning for the decision."
                            }
                        },
                        "required": ["action", "reasoning"]
                    },
                    automatic_function_calling=types.AutomaticFunctionCallingConfig(
                        maximum_remote_calls=1000
                    )
                )
            )
            return json.loads(response.text)
        except Exception as e:
            err_msg = str(e)
            if "429" in err_msg or "ResourceExhausted" in err_msg or "rate limit" in err_msg.lower():
                logger.warning(f"Rate limit error encountered from Gemini API. Sleeping for {backoff_seconds}s and retrying... (Attempt {attempt+1}/{max_retries})")
                time.sleep(backoff_seconds)
                backoff_seconds *= 2
            else:
                logger.error(f"Gemini API Execution Error: {e}")
                break
                
    return None

# Main backtester runner
def run_backtest_for_symbol(symbol, initial_capital, step_interval=1):
    # Fetch historical data (LTF)
    df = fetch_historical_data_multiyear(symbol, TIMEFRAME, years=BACKTEST_YEARS)
    if df is None or df.empty:
        logger.error(f"No historical data compiled for {symbol}. Skipping.")
        return None, initial_capital

    # Fetch historical data (HTF)
    htf_timeframe = get_htf_timeframe(TIMEFRAME)
    htf_df = fetch_historical_data_multiyear(symbol, htf_timeframe, years=BACKTEST_YEARS)
    if htf_df is None or htf_df.empty:
        logger.error(f"No HTF historical data compiled for {symbol}. Skipping.")
        return None, initial_capital

    logger.info(f"Backtest dataset loaded successfully for {symbol}. Total LTF Candles: {len(df)}, HTF Candles: {len(htf_df)}")
    
    logger.info("Pre-calculating HTF trend bias sequentially...")
    htf_df['trend'] = precalculate_htf_trends(htf_df)
    
    # Shift HTF timestamps by their duration to prevent lookahead bias
    if htf_timeframe == "4h":
        htf_duration = pd.Timedelta(hours=4)
    elif htf_timeframe == "1h":
        htf_duration = pd.Timedelta(hours=1)
    else:
        htf_duration = pd.Timedelta(hours=4)
        
    htf_df_shifted = htf_df.copy()
    htf_df_shifted['datetime'] = htf_df_shifted['datetime'] + htf_duration
    
    logger.info("Aligning HTF trend bias to LTF timeline...")
    df['datetime'] = pd.to_datetime(df['datetime']).astype('datetime64[ns]')
    htf_df_shifted['datetime'] = pd.to_datetime(htf_df_shifted['datetime']).astype('datetime64[ns]')
    
    df = df.sort_values('datetime')
    htf_df_shifted = htf_df_shifted.sort_values('datetime')
    df = pd.merge_asof(df, htf_df_shifted[['datetime', 'trend']], on='datetime', direction='backward')
    df['trend'] = df['trend'].fillna('NEUTRAL')

    logger.info("Pre-calculating RSI(14) series on LTF...")
    df['rsi'] = calculate_rsi_series(df, period=14)
    logger.info(f"Timeline: From {df.iloc[0]['datetime']} to {df.iloc[-1]['datetime']}")
    
    # Convert series to numpy arrays for speed
    highs = df['high'].values
    lows = df['low'].values
    closes = df['close'].values
    rsis = df['rsi'].values
    datetimes = df['datetime'].values
    trends = df['trend'].values
    
    trades = []
    active_position = None
    account_capital = initial_capital  # Starting capital
    
    i = 40
    total_candles = len(df)
    
    logger.info(f"Starting historical simulation loop for {symbol} with evaluation step interval = {step_interval} candles...")
    while i < total_candles:
        current_price = closes[i]
        current_time = pd.to_datetime(datetimes[i])
        
        # 1. Manage active position if one exists
        if active_position:
            side = active_position['side']
            entry_price = active_position['entry_price']
            sl = active_position['stop_loss']
            tp = active_position['take_profit']
            be_triggered = active_position.get('break_even_triggered', False)
            initial_sl = active_position.get('initial_sl', sl)
            initial_risk = abs(entry_price - initial_sl)
            
            # Check for Break-Even Trigger (1:2 RRR move in our favor)
            if not be_triggered:
                if side == "BUY":
                    if highs[i] >= entry_price + 2.0 * initial_risk:
                        sl = entry_price
                        active_position['stop_loss'] = sl
                        active_position['break_even_triggered'] = True
                        logger.info(f"[BREAK-EVEN TRIGGERED] BUY Stop Loss moved to Entry ({entry_price:,.2f}) at {current_time}")
                elif side == "SELL":
                    if lows[i] <= entry_price - 2.0 * initial_risk:
                        sl = entry_price
                        active_position['stop_loss'] = sl
                        active_position['break_even_triggered'] = True
                        logger.info(f"[BREAK-EVEN TRIGGERED] SELL Stop Loss moved to Entry ({entry_price:,.2f}) at {current_time}")
            
            # Check price targets
            hit_sl = False
            hit_tp = False
            
            if side == "BUY":
                if lows[i] <= sl:
                    hit_sl = True
                elif highs[i] >= tp:
                    hit_tp = True
            elif side == "SELL":
                if highs[i] >= sl:
                    hit_sl = True
                elif lows[i] <= tp:
                    hit_tp = True
                    
            if hit_sl or hit_tp:
                exit_price = sl if hit_sl else tp
                pnl_ratio = (exit_price - entry_price) / entry_price if side == "BUY" else (entry_price - exit_price) / entry_price
                
                # Deduct transaction fees (0.1% buy + 0.1% sell = 0.20% roundtrip)
                fee_deduction = 0.002
                pnl_ratio -= fee_deduction
                
                trade_pnl_usd = active_position['size_usd'] * pnl_ratio
                account_capital += trade_pnl_usd
                pnl_pct = pnl_ratio * 100
                
                outcome = "LOSS (SL Hit)" if hit_sl else "WIN (TP Hit)"
                logger.info(f"[TRADE CLOSED] {outcome} at {current_time} | Exit Price: {exit_price:,.2f} | PnL: {pnl_pct:+.2f}% (${trade_pnl_usd:+.2f}) | Capital: ${account_capital:,.2f}")
                
                trades.append({
                    'side': side,
                    'entry_time': active_position['entry_time'],
                    'exit_time': current_time,
                    'entry_price': entry_price,
                    'exit_price': exit_price,
                    'stop_loss': sl,
                    'take_profit': tp,
                    'outcome': "WIN" if hit_tp else "LOSS",
                    'pnl_pct': pnl_pct,
                    'pnl_usd': trade_pnl_usd
                })
                active_position = None
            
            i += 1
            continue

        # 2. Check strategy setups at Step Intervals
        if i % step_interval == 0:
            current_time = df.iloc[i]['datetime']
            # Skip new trades on weekends (Saturday=5, Sunday=6)
            if current_time.weekday() in [5, 6]:
                i += 1
                continue
            htf_trend = trends[i]
            
            # Local calculation parameters using NumPy arrays
            last_high, last_high_idx, last_low, last_low_idx = get_structure_levels_with_rsi_np(highs, lows, i)
            structure_status = detect_structure_break_np(highs, lows, closes, i, last_high, last_low)
            ob_zones = find_high_prob_ob_np(highs, lows, i)
            
            # Calculate suggested setup levels mathematically
            suggested_setup = None
            current_high = highs[i]
            current_low = lows[i]
            current_close = closes[i]
            current_rsi = rsis[i]
            
            # Detect minor swing high/low points in the last 20 candles
            swing_highs = []
            swing_lows = []
            start_lookback = max(2, i - 20)
            for j in range(start_lookback, i - 1):
                if lows[j] < lows[j-1] and lows[j] < lows[j+1]:
                    swing_lows.append(lows[j])
                if highs[j] > highs[j-1] and highs[j] > highs[j+1]:
                    swing_highs.append(highs[j])
            
            direction = None
            ob_candidate = None
            
            # Dealing range equilibrium constraint
            equilibrium = last_low + 0.5 * (last_high - last_low)
            
            if htf_trend == "BULLISH" and current_close <= equilibrium:
                # Find extreme high and its inducement low in the last 40 candles
                extreme_high_idx = i - 1 - np.argmax(highs[i-40:i-1][::-1]) if i > 40 else i - 1
                inducement_low = None
                for j in range(extreme_high_idx - 1, max(0, i - 40), -1):
                    if j >= 1 and j < i - 1:
                        if lows[j] < lows[j-1] and lows[j] < lows[j+1]:
                            inducement_low = lows[j]
                            break
                if inducement_low is None and extreme_high_idx > max(0, i - 40):
                    inducement_low = np.min(lows[max(0, i-40):extreme_high_idx]) if extreme_high_idx > max(0, i-40) else lows[i-1]
                
                if inducement_low is not None:
                    # Filter OBs: Entry must be <= inducement_low (Extreme POI to avoid SMT trap)
                    bullish_obs = [ob for ob in ob_zones if ob['type'] == 'Strong Bullish OB' and ob['entry'] <= inducement_low]
                else:
                    bullish_obs = [ob for ob in ob_zones if ob['type'] == 'Strong Bullish OB']
                
                # Check for mitigation of any valid Extreme OB
                for ob in bullish_obs:
                    if current_low <= ob['entry'] and current_close >= ob['sl']:
                        # Check for local swing sweep trigger (Trigger A / Simple Swing Sweep)
                        for swing_low in swing_lows:
                            if current_low < swing_low and current_close >= swing_low:
                                direction = "BUY"
                                ob_candidate = ob
                                break
                        if direction:
                            break
            
            if direction == "BUY":
                suggested_entry = current_price
                sl = current_low * 0.9995
                risk = suggested_entry - sl
                min_risk = suggested_entry * MIN_SL_DIST_PCT
                if risk < min_risk:
                    sl = suggested_entry - min_risk
                    risk = min_risk
                tp = suggested_entry + TARGET_RRR * risk
                    
                suggested_setup = {
                    "direction": direction,
                    "entry": suggested_entry,
                    "sl": sl,
                    "tp": tp
                }

            if suggested_setup is None:
                i += 1
                continue
                
            # Estimate configuration using suggested SL for size calculation
            size_suggestions = crypto_position_calculator(account_capital, RISK_PER_TRADE, current_price, suggested_setup['sl'])
            
            # Slice dataframe only when about to query model
            df_slice = df.iloc[i-40:i]
            formatted_data = format_candles(df_slice)
            
            logger.info(f"Evaluating strategy for {symbol} at candle index {i}/{total_candles} ({current_time}) | Price: {current_price:,.2f} | Setup: {suggested_setup['direction']} (SL: {suggested_setup['sl']:,.2f}, TP: {suggested_setup['tp']:,.2f}) | HTF Trend: {htf_trend}...")
            
            if SKIP_GEMINI_CONFIRMATION:
                decision = {"action": suggested_setup['direction'], "reasoning": "Skipped Gemini confirmation - Rule Only Mode"}
            else:
                decision = query_model(symbol, formatted_data, structure_status, ob_zones, size_suggestions, suggested_setup, htf_trend)
                time.sleep(0.5)  # Rate limit cooloff for Gemini API
            
            if decision:
                action = decision.get("action", "HOLD").upper()
                reasoning = decision.get("reasoning", "")
                
                if action in ["BUY", "SELL"]:
                    if action != suggested_setup['direction']:
                        logger.warning(f"Strategy returned {action} but Python setup was {suggested_setup['direction']}. Skipping.")
                    else:
                        sl = suggested_setup['sl']
                        tp = suggested_setup['tp']
                        
                        final_size_metrics = crypto_position_calculator(account_capital, RISK_PER_TRADE, current_price, sl)
                        size_usd = final_size_metrics.get("position_size_usd", account_capital * 0.05)
                        if size_usd <= 0:
                            size_usd = account_capital * 0.05
                            
                        quantity = size_usd / current_price
                        
                        logger.info(f"[TRADE ENTERED] {action} for {symbol} at {current_time} | Entry Price: {current_price:,.2f} | SL: {sl:,.2f} | TP: {tp:,.2f} | Position Size: ${size_usd:,.2f}")
                        logger.info(f"Reasoning: {reasoning}")
                        
                        active_position = {
                            'side': action,
                            'entry_price': current_price,
                            'stop_loss': sl,
                            'take_profit': tp,
                            'quantity': quantity,
                            'size_usd': size_usd,
                            'entry_time': current_time,
                            'initial_sl': sl,
                            'break_even_triggered': False
                        }
            if not SKIP_GEMINI_CONFIRMATION:
                time.sleep(0.2)  # Cooloff period
            
        i += 1

    # Check for unclosed trades at final data candle
    if active_position:
        logger.info(f"Position left open at end of dataset. Resolving at final price: {df.iloc[-1]['close']:,.2f}")
        current_candle = df.iloc[-1]
        exit_price = current_candle['close']
        side = active_position['side']
        entry_price = active_position['entry_price']
        
        pnl_ratio = (exit_price - entry_price) / entry_price if side == "BUY" else (entry_price - exit_price) / entry_price
        pnl_ratio -= 0.002
        trade_pnl_usd = active_position['size_usd'] * pnl_ratio
        account_capital += trade_pnl_usd
        pnl_pct = pnl_ratio * 100
        
        trades.append({
            'side': side,
            'entry_time': active_position['entry_time'],
            'exit_time': current_candle['datetime'],
            'entry_price': entry_price,
            'exit_price': exit_price,
            'stop_loss': active_position['stop_loss'],
            'take_profit': active_position['take_profit'],
            'outcome': "OPEN_EXIT",
            'pnl_pct': pnl_pct,
            'pnl_usd': trade_pnl_usd
        })
        active_position = None

    return trades, account_capital

# Generate and print the performance summary
def print_summary(symbol, trades, initial_capital, final_capital):
    print("\n" + "="*60)
    print(f"                 BACKTEST SUMMARY FOR {symbol}")
    print("="*60)
    
    total_trades = len(trades)
    if total_trades == 0:
        print(f"No trades were executed during the backtest for {symbol}.")
        print("="*60)
        return
        
    wins = [t for t in trades if t['outcome'] == "WIN"]
    losses = [t for t in trades if t['outcome'] == "LOSS"]
    open_exits = [t for t in trades if t['outcome'] == "OPEN_EXIT"]
    
    total_wins = len(wins)
    total_losses = len(losses)
    total_open = len(open_exits)
    
    win_rate = (total_wins / (total_wins + total_losses)) * 100 if (total_wins + total_losses) > 0 else 0
    net_pnl_usd = final_capital - initial_capital
    net_pnl_pct = (net_pnl_usd / initial_capital) * 100
    
    print(f"Trading Symbol:     {symbol}")
    print(f"Timeframe:          {TIMEFRAME}")
    print(f"Initial Capital:    ${initial_capital:,.2f}")
    print(f"Final Capital:      ${final_capital:,.2f}")
    print(f"Net Profit/Loss:    ${net_pnl_usd:+.2f} ({net_pnl_pct:+.2f}%)")
    print(f"Total Trades:       {total_trades}")
    print(f"Wins:               {total_wins}")
    print(f"Losses:             {total_losses}")
    print(f"Open Exits:         {total_open}")
    print(f"Win Rate:           {win_rate:.2f}%")
    print("="*60)
    print("\nDetail Trade Logs:")
    for idx, t in enumerate(trades, 1):
        print(f"{idx}. {t['side']} Entry: {t['entry_time']} (${t['entry_price']:,.2f}) -> Exit: {t['exit_time']} (${t['exit_price']:,.2f}) | PnL: {t['pnl_pct']:+.2f}% (${t['pnl_usd']:+.2f}) | Outcome: {t['outcome']}")
    print("="*60)

if __name__ == "__main__":
    symbols = [s.strip() for s in TRADING_SYMBOLS.split(",")]
    logger.info(f"Loaded symbols for portfolio backtest: {symbols}")
    
    capital_per_symbol = INITIAL_CAPITAL / len(symbols)
    logger.info(f"Allocating capital per symbol: ${capital_per_symbol:,.2f} (Total Portfolio Capital: ${INITIAL_CAPITAL:,.2f})")
    
    all_portfolio_trades = []
    portfolio_final_capital = 0.0
    
    for symbol in symbols:
        logger.info(f"\n" + "="*80)
        logger.info(f"RUNNING BACKTEST FOR {symbol}")
        logger.info("="*80)
        
        trades, final_capital = run_backtest_for_symbol(symbol, capital_per_symbol, step_interval=1)
        
        if trades is not None:
            all_portfolio_trades.extend(trades)
            portfolio_final_capital += final_capital
            print_summary(symbol, trades, capital_per_symbol, final_capital)
        else:
            portfolio_final_capital += capital_per_symbol
            
    # Print the Final Combined Portfolio Summary
    print("\n" + "#"*80)
    print("                 FINAL COMBINED PORTFOLIO SUMMARY")
    print("#"*80)
    print(f"Portfolio Symbols:   {', '.join(symbols)}")
    print(f"Timeframe:          {TIMEFRAME}")
    print(f"Initial Capital:    ${INITIAL_CAPITAL:,.2f}")
    print(f"Final Capital:      ${portfolio_final_capital:,.2f}")
    
    net_pnl_usd = portfolio_final_capital - INITIAL_CAPITAL
    net_pnl_pct = (net_pnl_usd / INITIAL_CAPITAL) * 100
    
    print(f"Net Profit/Loss:    ${net_pnl_usd:+.2f} ({net_pnl_pct:+.2f}%)")
    print(f"Total Portfolio Trades: {len(all_portfolio_trades)}")
    
    total_wins = sum(1 for t in all_portfolio_trades if t['outcome'] == "WIN")
    total_losses = sum(1 for t in all_portfolio_trades if t['outcome'] == "LOSS")
    total_open = sum(1 for t in all_portfolio_trades if t['outcome'] == "OPEN_EXIT")
    
    portfolio_win_rate = (total_wins / (total_wins + total_losses)) * 100 if (total_wins + total_losses) > 0 else 0
    print(f"Wins:               {total_wins}")
    print(f"Losses:             {total_losses}")
    print(f"Open Exits:         {total_open}")
    print(f"Portfolio Win Rate: {portfolio_win_rate:.2f}%")
    print("#"*80)
