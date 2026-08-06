import os
import time
import json
import logging
import sys
from dotenv import load_dotenv
import pandas as pd
import ccxt
from google import genai
from google.genai import types

# Import the SMC strategy rules context
from strategy_context import STRATEGY_CONTEXT

# Setup Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler("bot.log", mode="a", encoding="utf-8")
    ]
)
logger = logging.getLogger("KuCoinGeminiBot")

# Load environment variables
load_dotenv()

KUCOIN_API_KEY = os.getenv("KUCOIN_API_KEY")
KUCOIN_SECRET = os.getenv("KUCOIN_SECRET")
KUCOIN_PASSPHRASE = os.getenv("KUCOIN_PASSPHRASE")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash")
TRADING_SYMBOL = os.getenv("TRADING_SYMBOL", "BTC/USDT")
TRADING_SYMBOLS = os.getenv("TRADING_SYMBOLS", TRADING_SYMBOL)
TIMEFRAME = os.getenv("TIMEFRAME", "5m")
DRY_RUN_ENV = os.getenv("DRY_RUN", "True").lower() == "true"

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

SKIP_GEMINI_CONFIRMATION = os.getenv("SKIP_GEMINI_CONFIRMATION", "False").lower() == "true"

# Define state file path
STATE_FILE = "trade_state.json"

# Check if credentials are placeholders or missing
def is_placeholder(val):
    return not val or "your_" in val.lower() or val == ""

has_kucoin_creds = not (
    is_placeholder(KUCOIN_API_KEY) or 
    is_placeholder(KUCOIN_SECRET) or 
    is_placeholder(KUCOIN_PASSPHRASE)
)

# Determine final dry run mode
DRY_RUN = DRY_RUN_ENV or not has_kucoin_creds

if DRY_RUN:
    logger.warning("==================================================================")
    logger.warning("BOT IS RUNNING IN DRY RUN (SIMULATION) MODE.")
    if not has_kucoin_creds:
        logger.warning("Reason: KuCoin API credentials are not fully configured in .env.")
    else:
        logger.warning("Reason: DRY_RUN is set to True in .env.")
    logger.warning("No real orders will be placed on KuCoin. All trades are simulated.")
    logger.warning("==================================================================")
else:
    logger.info("==================================================================")
    logger.info("BOT IS RUNNING IN LIVE TRADING MODE.")
    logger.info("Real orders will be placed on KuCoin. Risk warning: Capital at risk.")
    logger.info("==================================================================")

# Initialize Gemini API Client
if is_placeholder(GEMINI_API_KEY):
    logger.error("GEMINI_API_KEY is not configured in .env. Please configure it to run the bot.")
    sys.exit(1)

client = genai.Client(api_key=GEMINI_API_KEY)

# Initialize KuCoin Exchange client using CCXT
exchange_config = {
    'enableRateLimit': True,
    'options': {
        'defaultType': 'spot'
    }
}

if not DRY_RUN:
    exchange_config.update({
        'apiKey': KUCOIN_API_KEY,
        'secret': KUCOIN_SECRET,
        'password': KUCOIN_PASSPHRASE,
    })

exchange = ccxt.kucoin(exchange_config)


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

def get_structure_levels_with_rsi(df):
    """
    Finds the most recent completed swing high and swing low in the dataframe slice
    (excluding the last candle) and returns their values and slice integer indices.
    """
    n = len(df)
    if n < 5:
        high_val = df['high'].iloc[:-1].max() if n > 1 else 0.0
        low_val = df['low'].iloc[:-1].min() if n > 1 else 0.0
        high_idx = df['high'].iloc[:-1].values.argmax() if n > 1 else 0
        low_idx = df['low'].iloc[:-1].values.argmin() if n > 1 else 0
        return high_val, high_idx, low_val, low_idx
        
    last_high = None
    last_high_idx = None
    last_low = None
    last_low_idx = None
    
    for j in range(n - 4, 1, -1):
        if (df['high'].iloc[j] >= df['high'].iloc[j-1] and df['high'].iloc[j] >= df['high'].iloc[j-2] and
            df['high'].iloc[j] >= df['high'].iloc[j+1] and df['high'].iloc[j] >= df['high'].iloc[j+2]):
            last_high = df['high'].iloc[j]
            last_high_idx = j
            break
            
    for j in range(n - 4, 1, -1):
        if (df['low'].iloc[j] <= df['low'].iloc[j-1] and df['low'].iloc[j] <= df['low'].iloc[j-2] and
            df['low'].iloc[j] <= df['low'].iloc[j+1] and df['low'].iloc[j] <= df['low'].iloc[j+2]):
            last_low = df['low'].iloc[j]
            last_low_idx = j
            break
            
    if last_high is None:
        last_high = df['high'].iloc[:-1].max()
        last_high_idx = df['high'].iloc[:-1].values.argmax()
    if last_low is None:
        last_low = df['low'].iloc[:-1].min()
        last_low_idx = df['low'].iloc[:-1].values.argmin()
        
    return last_high, last_high_idx, last_low, last_low_idx


def detect_structure_break(df):
    """
    Analyzes price structure using pandas to identify real BOS/CHOCH 
    vs. Liquidity Sweeps based on candle body close, ensuring triggers 
    only occur on the initial cross event (crossing high/low).
    """
    if len(df) < 5:
        return "No Structural Change"
        
    last_high, _, last_low, _ = get_structure_levels_with_rsi(df)
    
    current_close = df['close'].iloc[-1]
    current_high = df['high'].iloc[-1]
    current_low = df['low'].iloc[-1]
    
    prev_close = df['close'].iloc[-2]
    prev_high = df['high'].iloc[-2]
    prev_low = df['low'].iloc[-2]

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


def determine_htf_trend(htf_df):
    """
    Analyzes the HTF dataframe to determine the current trend bias.
    BOS/CHOCH is confirmed ONLY when the candle BODY closes beyond the previous structural swing level.
    Wick-only crosses are treated as Liquidity Sweeps and do not change the trend bias.
    """
    n = len(htf_df)
    if n < 5:
        return 'NEUTRAL'
        
    trend = 'NEUTRAL'
    swing_highs = []
    swing_lows = []
    
    for i in range(2, n - 2):
        # Identify swing high (HTF structure point)
        if (htf_df['high'].iloc[i] >= htf_df['high'].iloc[i-1] and htf_df['high'].iloc[i] >= htf_df['high'].iloc[i-2] and
            htf_df['high'].iloc[i] >= htf_df['high'].iloc[i+1] and htf_df['high'].iloc[i] >= htf_df['high'].iloc[i+2]):
            swing_highs.append((htf_df['high'].iloc[i], i))
            
        # Identify swing low (HTF structure point)
        if (htf_df['low'].iloc[i] <= htf_df['low'].iloc[i-1] and htf_df['low'].iloc[i] <= htf_df['low'].iloc[i-2] and
            htf_df['low'].iloc[i] <= htf_df['low'].iloc[i+1] and htf_df['low'].iloc[i] <= htf_df['low'].iloc[i+2]):
            swing_lows.append((htf_df['low'].iloc[i], i))
            
        # Update trend sequentially based on body closes beyond swing levels
        if swing_highs:
            last_sh = swing_highs[-1][0]
            if htf_df['close'].iloc[i] > last_sh:
                trend = 'BULLISH'
        if swing_lows:
            last_sl = swing_lows[-1][0]
            if htf_df['close'].iloc[i] < last_sl:
                trend = 'BEARISH'
                
    # Check the latest candle close for any immediate structural breaks
    if swing_highs:
        last_sh = swing_highs[-1][0]
        for j in range(max(0, n-2), n):
            if htf_df['close'].iloc[j] > last_sh:
                trend = 'BULLISH'
    if swing_lows:
        last_sl = swing_lows[-1][0]
        for j in range(max(0, n-2), n):
            if htf_df['close'].iloc[j] < last_sl:
                trend = 'BEARISH'
                
    return trend


def find_high_prob_ob(df):
    """
    Filters high-probability Order Blocks by checking for strict triple constraint:
    1. Liquidity Capture: Wick swept previous candle's low (for bullish) or high (for bearish).
    2. FVG Generation: Left an immediate Fair Value Gap between candle (i) and candle (i+2).
    3. Currently Unmitigated: No subsequent candle's wick has touched/penetrated the OB zone (from i+3 to the current candle).
    """
    ob_zones = []
    n = len(df)
    for i in range(1, n - 2):
        # Bullish OB Check
        swept_liquidity_bull = df['low'].iloc[i] < df['low'].iloc[i-1]
        has_bullish_fvg = df['low'].iloc[i+2] > df['high'].iloc[i]
        
        if swept_liquidity_bull and has_bullish_fvg:
            # Check for mitigation: did any subsequent price retrace and touch this zone?
            mitigated = False
            for j in range(i + 3, n):
                if df['low'].iloc[j] <= df['high'].iloc[i]:
                    mitigated = True
                    break
            if not mitigated:
                ob_zones.append({
                    'entry': df['high'].iloc[i],
                    'sl': df['low'].iloc[i],
                    'type': 'Strong Bullish OB',
                    'candle_index': i
                })

        # Bearish OB Check
        swept_liquidity_bear = df['high'].iloc[i] > df['high'].iloc[i-1]
        has_bearish_fvg = df['high'].iloc[i+2] < df['low'].iloc[i]
        
        if swept_liquidity_bear and has_bearish_fvg:
            # Check for mitigation: did any subsequent price retrace and touch this zone?
            mitigated = False
            for j in range(i + 3, n):
                if df['high'].iloc[j] >= df['low'].iloc[i]:
                    mitigated = True
                    break
            if not mitigated:
                ob_zones.append({
                    'entry': df['low'].iloc[i],
                    'sl': df['high'].iloc[i],
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


# --- STATE & UTILITY FUNCTIONS ---

def load_trade_state():
    default_state = {"positions": {}}
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE, "r") as f:
                state = json.load(f)
                if "positions" in state:
                    return state
                
                # Migrate old format if necessary
                if "in_position" in state:
                    logger.info("Migrating old trade state format to multi-symbol format.")
                    migrated_state = {"positions": {}}
                    if state.get("in_position"):
                        migrated_state["positions"][TRADING_SYMBOL] = {
                            "in_position": True,
                            "side": state.get("side"),
                            "entry_price": state.get("entry_price"),
                            "stop_loss": state.get("stop_loss"),
                            "take_profit": state.get("take_profit"),
                            "quantity": state.get("quantity", 0.0),
                            "initial_sl": state.get("initial_sl"),
                            "break_even_triggered": state.get("break_even_triggered", False)
                        }
                    return migrated_state
        except Exception as e:
            logger.error(f"Error loading trade state: {e}. Resetting state.")
    return default_state

def save_trade_state(state):
    try:
        with open(STATE_FILE, "w") as f:
            json.dump(state, f, indent=4)
    except Exception as e:
        logger.error(f"Error saving trade state: {e}")

def fetch_ohlcv_data(symbol, timeframe, limit=50):
    try:
        logger.info(f"Fetching {limit} candles for {symbol} on {timeframe} timeframe...")
        ohlcv = exchange.fetch_ohlcv(symbol, timeframe, limit=limit)
        df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
        df['datetime'] = pd.to_datetime(df['timestamp'], unit='ms')
        df = df[['datetime', 'open', 'high', 'low', 'close', 'volume']]
        return df
    except Exception as e:
        logger.error(f"Error fetching OHLCV data from exchange: {e}")
        return None

def format_market_data(df):
    if df is None or df.empty:
        return ""
    recent_df = df.tail(40).copy()
    recent_df['datetime'] = recent_df['datetime'].dt.strftime('%Y-%m-%d %H:%M')
    
    table_str = recent_df.to_string(index=False, formatters={
        'open': '{:,.2f}'.format,
        'high': '{:,.2f}'.format,
        'low': '{:,.2f}'.format,
        'close': '{:,.2f}'.format,
        'volume': '{:,.4f}'.format,
        'rsi': '{:,.2f}'.format
    })
    return table_str


# --- MODEL STRATEGY QUERYING ---

def get_strategy_decision(symbol, market_data_str, structure_status, ob_zones, size_suggestions, suggested_setup, htf_trend):
    # Format the pre-computed metrics into the prompt
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
    try:
        logger.info("Sending market data and pre-computed indicators to Gemini model...")
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
        decision = json.loads(response.text)
        return decision
    except json.JSONDecodeError as je:
        logger.error(f"Error parsing Gemini response as JSON. Raw response: {response.text}")
        return None
    except Exception as e:
        logger.error(f"Error calling Gemini API: {e}")
        return None


# --- ORDER EXECUTION LOGIC ---

def execute_order(side, symbol, price, decision, size_usd):
    try:
        if not DRY_RUN:
            exchange.load_markets()
            market = exchange.market(symbol)
        else:
            market = {
                'base': symbol.split('/')[0],
                'quote': symbol.split('/')[1],
                'precision': {'amount': 6, 'price': 2},
                'limits': {'amount': {'min': 0.00001}}
            }

        state = load_trade_state()

        if side == "BUY":
            # Dynamic size based on risk calculation
            trade_size_quote = size_usd
            
            # Fetch balance if live
            if not DRY_RUN:
                balances = exchange.fetch_balance()
                quote_balance = balances.get(market['quote'], {}).get('free', 0.0)
                logger.info(f"Available balance: {quote_balance:.2f} {market['quote']}")
                if quote_balance < trade_size_quote:
                    logger.warning(f"Insufficient {market['quote']} balance. Need {trade_size_quote:.2f}, but only have {quote_balance:.2f}. Scaling down trade...")
                    trade_size_quote = quote_balance * 0.95  # Use 95% of available
            else:
                logger.info(f"[DRY RUN] Simulating balance check. Calculated Trade Size: {trade_size_quote:.2f} {market['quote']}")

            quantity = trade_size_quote / price
            
            if not DRY_RUN:
                quantity_str = exchange.amount_to_precision(symbol, quantity)
                quantity = float(quantity_str)
            else:
                quantity = round(quantity, market['precision']['amount'])

            if quantity < market['limits']['amount']['min']:
                logger.warning(f"Calculated quantity {quantity} is less than minimum order size {market['limits']['amount']['min']}")
                return False

            logger.info(f"Placing {side} Market Order for {quantity} {market['base']} at approx {price} {market['quote']}...")

            if not DRY_RUN:
                order = exchange.create_market_buy_order(symbol, quantity)
                logger.info(f"Order executed successfully! Order ID: {order.get('id')}")
                actual_price = order.get('price') or price
                actual_qty = order.get('filled') or quantity
            else:
                logger.info(f"[DRY RUN] Simulated order filled successfully.")
                actual_price = price
                actual_qty = quantity

            # Initialize symbol sub-state if not present
            if "positions" not in state:
                state["positions"] = {}
                
            state["positions"][symbol] = {
                "in_position": True,
                "side": "BUY",
                "entry_price": actual_price,
                "stop_loss": decision.get("stop_loss"),
                "take_profit": decision.get("take_profit"),
                "quantity": actual_qty,
                "initial_sl": decision.get("stop_loss"),
                "break_even_triggered": False
            }
            save_trade_state(state)
            
            logger.info(f"Position opened for {symbol}. Entry: {actual_price}, SL: {decision.get('stop_loss')}, TP: {decision.get('take_profit')}")
            return True

        elif side == "SELL":
            sym_state = state.get("positions", {}).get(symbol, {})
            quantity = sym_state.get("quantity", 0.0)
            if quantity == 0.0:
                if not DRY_RUN:
                    balances = exchange.fetch_balance()
                    quantity = balances.get(market['base'], {}).get('free', 0.0)
                else:
                    quantity = 0.0002
            
            if not DRY_RUN:
                quantity_str = exchange.amount_to_precision(symbol, quantity)
                quantity = float(quantity_str)
            else:
                quantity = round(quantity, market['precision']['amount'])

            if quantity <= 0:
                logger.warning(f"No {market['base']} quantity available to sell for {symbol}.")
                return False

            logger.info(f"Placing {side} Market Order for {quantity} {market['base']} to close position for {symbol}...")

            if not DRY_RUN:
                order = exchange.create_market_sell_order(symbol, quantity)
                logger.info(f"Exit Order executed successfully! Order ID: {order.get('id')}")
            else:
                logger.info(f"[DRY RUN] Simulated exit order filled successfully.")

            # Reset trade state for this symbol
            state["positions"][symbol] = {
                "in_position": False,
                "side": None,
                "entry_price": None,
                "stop_loss": None,
                "take_profit": None,
                "quantity": 0.0,
                "initial_sl": None,
                "break_even_triggered": False
            }
            save_trade_state(state)
            logger.info(f"Position closed and state reset for {symbol}.")
            return True

    except Exception as e:
        logger.error(f"Error executing order: {e}")
        return False


# --- BOT MAIN CYCLE ---

def run_cycle():
    logger.info("Starting new trading cycle for all symbols...")
    
    symbols = [s.strip() for s in TRADING_SYMBOLS.split(",")]
    state = load_trade_state()
    if "positions" not in state:
        state["positions"] = {}
        
    # Count current active positions
    active_count = sum(1 for sym in symbols if state["positions"].get(sym, {}).get("in_position", False))
    logger.info(f"Current active positions: {active_count}/{MAX_CONCURRENT_TRADES}")
    
    for symbol in symbols:
        try:
            logger.info(f"\n--- Processing Symbol: {symbol} ---")
            sym_state = state["positions"].get(symbol, {
                "in_position": False,
                "side": None,
                "entry_price": None,
                "stop_loss": None,
                "take_profit": None,
                "quantity": 0.0,
                "initial_sl": None,
                "break_even_triggered": False
            })
            
            # Fetch LTF data
            df = fetch_ohlcv_data(symbol, TIMEFRAME, limit=60)
            if df is None or df.empty:
                logger.error(f"Could not fetch market data for {symbol}. Skipping.")
                continue

            # Fetch HTF data
            htf_timeframe = get_htf_timeframe(TIMEFRAME)
            htf_df = fetch_ohlcv_data(symbol, htf_timeframe, limit=60)
            if htf_df is None or htf_df.empty:
                logger.error(f"Could not fetch HTF market data for {symbol}. Skipping.")
                continue

            latest_candle = df.iloc[-1]
            current_price = latest_candle['close']
            logger.info(f"Current price of {symbol}: {current_price:.2f}")
            
            # Calculate RSI
            df['rsi'] = calculate_rsi_series(df, period=14)

            # If in position, manage it
            if sym_state.get("in_position"):
                entry_price = sym_state['entry_price']
                sl = sym_state['stop_loss']
                tp = sym_state['take_profit']
                be_triggered = sym_state.get('break_even_triggered', False)
                initial_sl = sym_state.get('initial_sl', sl)
                initial_risk = abs(entry_price - initial_sl)
                
                # Check for Break-Even Trigger (1:2 RRR move in our favor)
                if not be_triggered:
                    side = sym_state.get("side", "BUY")
                    if side == "BUY" and current_price >= entry_price + 2.0 * initial_risk:
                        sym_state['stop_loss'] = entry_price
                        sym_state['break_even_triggered'] = True
                        state["positions"][symbol] = sym_state
                        save_trade_state(state)
                        logger.info(f"[BREAK-EVEN TRIGGERED] {symbol} Stop Loss moved to Entry ({entry_price:.2f})")
                        sl = entry_price
                    elif side == "SELL" and current_price <= entry_price - 2.0 * initial_risk:
                        sym_state['stop_loss'] = entry_price
                        sym_state['break_even_triggered'] = True
                        state["positions"][symbol] = sym_state
                        save_trade_state(state)
                        logger.info(f"[BREAK-EVEN TRIGGERED] {symbol} Stop Loss moved to Entry ({entry_price:.2f})")
                        sl = entry_price
                    
                # Check Stop Loss
                if current_price <= sl:
                    logger.warning(f"Price ({current_price:.2f}) hit Stop Loss ({sl:.2f}) for {symbol}. Triggering market exit...")
                    execute_order("SELL", symbol, current_price, None, 0.0)
                    active_count = max(0, active_count - 1)
                    continue

                # Check Take Profit
                if current_price >= tp:
                    logger.info(f"Price ({current_price:.2f}) hit Take Profit ({tp:.2f}) for {symbol}. Triggering market exit...")
                    execute_order("SELL", symbol, current_price, None, 0.0)
                    active_count = max(0, active_count - 1)
                    continue
                    
                logger.info(f"Active position for {symbol} is within bounds. Checking if strategy recommends exit/change...")
                
            # If not in position, check if we can enter
            if not sym_state.get("in_position"):
                if active_count >= MAX_CONCURRENT_TRADES:
                    logger.info(f"Max concurrent trades reached ({active_count}/{MAX_CONCURRENT_TRADES}). Skipping entry check for {symbol}.")
                    continue
                    
                # Check weekend filter
                last_candle_time = df['datetime'].iloc[-1]
                if last_candle_time.weekday() in [5, 6]:
                    logger.info(f"Today is a weekend ({last_candle_time.strftime('%A')}). Skipping new trade evaluations for {symbol}.")
                    continue

            # Calculate local Indicators
            df_slice = df.tail(40).copy()
            structure_status = detect_structure_break(df_slice)
            ob_zones = find_high_prob_ob(df_slice)
            htf_trend = determine_htf_trend(htf_df)
            
            # Calculate suggested setup levels mathematically
            suggested_setup = None
            last_high, last_high_idx, last_low, last_low_idx = get_structure_levels_with_rsi(df_slice)
            
            highs_slice = df_slice['high'].values
            lows_slice = df_slice['low'].values
            closes_slice = df_slice['close'].values
            
            current_high = highs_slice[-1]
            current_low = lows_slice[-1]
            current_close = closes_slice[-1]
            
            # Detect minor swing high/low points in the last 20 candles of our slice
            swing_highs = []
            swing_lows = []
            start_lookback = 19
            for j in range(start_lookback, 38):
                if lows_slice[j] < lows_slice[j-1] and lows_slice[j] < lows_slice[j+1]:
                    swing_lows.append(lows_slice[j])
                if highs_slice[j] > highs_slice[j-1] and highs_slice[j] > highs_slice[j+1]:
                    swing_highs.append(highs_slice[j])
                    
            direction = None
            ob_candidate = None
            
            # Dealing range equilibrium constraint
            equilibrium = last_low + 0.5 * (last_high - last_low)
            
            if htf_trend == "BULLISH" and current_close <= equilibrium:
                # Find extreme high in the last 40 candles
                extreme_high_idx = 39 - np.argmax(highs_slice[::-1])
                inducement_low = None
                for j in range(extreme_high_idx - 1, 0, -1):
                    if j >= 1 and j < 38:
                        if lows_slice[j] < lows_slice[j-1] and lows_slice[j] < lows_slice[j+1]:
                            inducement_low = lows_slice[j]
                            break
                if inducement_low is None and extreme_high_idx > 0:
                    inducement_low = np.min(lows_slice[:extreme_high_idx]) if extreme_high_idx > 0 else lows_slice[-2]
                    
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
                logger.info(f"No valid Structure Break or Liquidity Sweep found for {symbol}. Skipping Gemini query. HTF Trend: {htf_trend}")
                continue
                
            # Estimate size using suggested SL for size calculation
            est_balance = INITIAL_CAPITAL / MAX_CONCURRENT_TRADES
            if not DRY_RUN:
                try:
                    balances = exchange.fetch_balance()
                    total_wallet = balances.get('USDT', {}).get('total', INITIAL_CAPITAL)
                    est_balance = total_wallet / MAX_CONCURRENT_TRADES
                except Exception:
                    pass
                    
            nearest_sl = suggested_setup['sl']
            size_suggestions = crypto_position_calculator(est_balance, RISK_PER_TRADE, current_price, nearest_sl)
            
            # Format candle data and append indicators
            market_data_str = format_market_data(df)
            
            if SKIP_GEMINI_CONFIRMATION:
                decision = {"action": suggested_setup['direction'], "reasoning": "Skipped Gemini confirmation - Rule Only Mode"}
            else:
                # Query Gemini
                decision = get_strategy_decision(symbol, market_data_str, structure_status, ob_zones, size_suggestions, suggested_setup, htf_trend)
                time.sleep(0.5)  # Rate limit cooloff for Gemini API
            if not decision:
                logger.warning(f"No valid decision parsed from strategy model for {symbol}. Skipping execution.")
                continue

            logger.info(f"Strategy Decision for {symbol}: Action={decision.get('action')}, Reasoning: {decision.get('reasoning')}")
            action = decision.get("action", "HOLD").upper()
            
            # Process Decision
            if action == "BUY":
                if sym_state.get("in_position"):
                    logger.info(f"Strategy recommends BUY, but bot is already in a position for {symbol}. Holding.")
                else:
                    if action != suggested_setup['direction']:
                        logger.warning(f"Strategy recommended BUY, but Python setup was {suggested_setup['direction']} for {symbol}. Skipping.")
                    else:
                        sl_level = suggested_setup['sl']
                        tp_level = suggested_setup['tp']
                        final_decision = {
                            "action": "BUY",
                            "reasoning": decision.get("reasoning", ""),
                            "stop_loss": sl_level,
                            "take_profit": tp_level
                        }
                        final_size = crypto_position_calculator(est_balance, RISK_PER_TRADE, current_price, sl_level)
                        size_usd = final_size.get("position_size_usd", est_balance * 0.95)
                        if size_usd <= 0:
                            size_usd = est_balance * 0.95
                        success = execute_order("BUY", symbol, current_price, final_decision, size_usd)
                        if success:
                            active_count += 1
            
            elif action == "SELL":
                if sym_state.get("in_position"):
                    logger.info(f"Strategy recommends SELL for {symbol}. Closing active position...")
                    success = execute_order("SELL", symbol, current_price, decision, 0.0)
                    if success:
                        active_count = max(0, active_count - 1)
                else:
                    logger.info(f"Strategy recommends SELL, but bot holds no active position for {symbol}. (Shorting is not supported on Spot).")
                    
            elif action == "HOLD":
                logger.info(f"Strategy recommends HOLD for {symbol}. No actions taken.")
            else:
                logger.warning(f"Unknown action recommendation for {symbol}: {action}")
                
        except Exception as e:
            logger.error(f"Error in run cycle for symbol {symbol}: {e}", exc_info=True)


# Main execution loop
if __name__ == "__main__":
    logger.info("Starting KuCoin Gemini SMC Trading Bot...")
    
    sleep_minutes = 5
    if TIMEFRAME.endswith("m"):
        try:
            sleep_minutes = int(TIMEFRAME[:-1])
        except ValueError:
            pass
    elif TIMEFRAME.endswith("h"):
        try:
            sleep_minutes = int(TIMEFRAME[:-1]) * 60
        except ValueError:
            pass

    sleep_seconds = sleep_minutes * 60
    logger.info(f"Bot configured to run every {sleep_minutes} minutes ({sleep_seconds} seconds).")

    while True:
        try:
            run_cycle()
        except KeyboardInterrupt:
            logger.info("Bot stopped by user. Exiting.")
            sys.exit(0)
        except Exception as e:
            logger.critical(f"Unhandled exception in main loop: {e}", exc_info=True)
        
        logger.info(f"Waiting for {sleep_minutes} minutes until next cycle...")
        time.sleep(sleep_seconds)
