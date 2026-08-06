import os
import re
import sys
from dotenv import load_dotenv
from google import genai

# Setup loading of environment variables
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash")

if not GEMINI_API_KEY:
    print("Error: GEMINI_API_KEY is not set in the environment or .env file.")
    sys.exit(1)

# Initialize Gemini Client
client = genai.Client(api_key=GEMINI_API_KEY)

def parse_losses(log_path="backtest.log"):
    if not os.path.exists(log_path):
        print(f"Error: {log_path} not found. Make sure the backtester is running/has run.")
        sys.exit(1)

    losses = []
    current_trade = None

    with open(log_path, "r", encoding="utf-8") as f:
        for line in f:
            # Check for trade entry
            entered_match = re.search(
                r"\[TRADE ENTERED\] (BUY|SELL) at (.*?) \| Entry Price: (.*?) \| SL: (.*?) \| TP: (.*?)(?: \||$)", 
                line
            )
            if entered_match:
                current_trade = {
                    "type": entered_match.group(1).strip(),
                    "entry_time": entered_match.group(2).strip(),
                    "entry_price": entered_match.group(3).strip(),
                    "sl": entered_match.group(4).strip(),
                    "tp": entered_match.group(5).strip(),
                    "reasoning": ""
                }
            
            # Extract reasoning for the trade
            if current_trade and " - Reasoning: " in line:
                reasoning_part = line.split(" - Reasoning: ", 1)[1].strip()
                current_trade["reasoning"] = reasoning_part
            
            # Check if current trade closed as a LOSS (SL Hit)
            closed_match = re.search(
                r"\[TRADE CLOSED\] LOSS \(SL Hit\) at (.*?) \| Exit Price: (.*?)(?: \||$)", 
                line
            )
            if closed_match and current_trade:
                current_trade["exit_time"] = closed_match.group(1).strip()
                current_trade["exit_price"] = closed_match.group(2).strip()
                losses.append(current_trade)
                current_trade = None
            
            # Reset current trade if it closed as a WIN (TP Hit) to avoid mismatching
            if "[TRADE CLOSED] WIN" in line:
                current_trade = None

    return losses

def main():
    print("Parsing backtest.log for losing trades...")
    losses = parse_losses("backtest.log")
    
    if not losses:
        print("No losing trades (SL Hit) found in backtest.log.")
        sys.exit(0)
    
    print(f"Isolated {len(losses)} losing trades.")

    # Construct the losing trades text payload
    trades_summary = []
    for idx, loss in enumerate(losses, 1):
        summary = (
            f"Trade #{idx}:\n"
            f"Type: {loss['type']}\n"
            f"Entry Time: {loss['entry_time']}\n"
            f"Exit Time: {loss['exit_time']}\n"
            f"Entry Price: {loss['entry_price']}\n"
            f"Stop Loss: {loss['sl']}\n"
            f"Take Profit: {loss['tp']}\n"
            f"Exit Price (SL Hit): {loss['exit_price']}\n"
            f"Gemini Reasoning: {loss['reasoning']}\n"
            f"{'-'*40}"
        )
        trades_summary.append(summary)
    
    trades_payload = "\n".join(trades_summary)

    # Diagnostic Prompt
    diagnostic_prompt = (
        "Act as an elite trading auditor and market mechanics expert. Analyze these specific losing trades executed by our SMC algorithmic bot. "
        "Based on the market prices and the reasonings provided, diagnose the core root causes of these failures. "
        "Group your analysis into distinct logical categories (e.g., structural traps, ranging market noise, premature mitigation entries) "
        "and provide definitive technical feedback on how the system's execution can be refined.\n\n"
        "Here are the losing trades:\n"
        f"{trades_payload}"
    )

    print(f"Querying model {GEMINI_MODEL} for audit report...")
    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=[diagnostic_prompt]
        )
        report_text = response.text
    except Exception as e:
        print(f"Error querying Gemini API: {e}")
        sys.exit(1)

    # Save to loss_analysis_report.txt first
    report_filename = "loss_analysis_report.txt"
    try:
        with open(report_filename, "w", encoding="utf-8") as f:
            f.write(report_text)
        print(f"Saved audit report safely to {report_filename}.")
    except Exception as e:
        print(f"Warning: Failed to save report to file: {e}")

    # Print the report to the terminal safely
    print("\n" + "="*80)
    print("ROOT CAUSE ANALYSIS REPORT")
    print("="*80)
    try:
        print(report_text)
    except UnicodeEncodeError:
        # Fallback for Windows terminal encoding restrictions
        fallback_encoding = sys.stdout.encoding or 'cp1252'
        safe_text = report_text.encode(fallback_encoding, errors='replace').decode(fallback_encoding)
        print(safe_text)
    print("="*80 + "\n")

if __name__ == "__main__":
    main()
