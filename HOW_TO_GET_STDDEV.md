# 📊 How to Get Portfolio Standard Deviation

## ✅ Method 1: Upload Statement (AUTOMATIC!)

**This is the EASIEST way** - it happens automatically when you upload your statement.

### Steps:
1. Open http://localhost:5173
2. Scroll to **"Upload Brokerage Statement"** section
3. Upload a screenshot/PDF of your statement
4. Click **"Parse Statement"**
5. Wait 5-10 seconds for Gemini AI to extract data
6. **AUTOMATIC:** Standard deviation calculates from historical data!

### What You'll See:
```
✅ Portfolio parsed successfully!

Total Value: $50,000
Cost Basis: $40,000
Unrealized Gain: $10,000 (+25%)

📊 Portfolio Standard Deviation: 24.82%
   Based on 1-year historical data
   This measures your portfolio's volatility. Lower is less risky.

Individual Stock Volatilities:
- AAPL (40%): 32.53%
- MSFT (30%): 24.82%
- GOOGL (30%): 32.31%

✨ Diversification Benefit
Weighted Average Volatility: 30.15%
Actual Portfolio Volatility: 24.82%
Risk Reduction: 5.33% thanks to diversification! 🎉

📊 Stock Correlations
AAPL ↔ MSFT: 0.519
AAPL ↔ GOOGL: 0.490
MSFT ↔ GOOGL: 0.508
```

## Method 2: Manual API Call

If you want to calculate it manually without uploading a statement:

```bash
curl -X POST http://localhost:3001/api/calculate-portfolio-stddev \
  -H "Content-Type: application/json" \
  -d '{
    "holdings": [
      {"symbol": "AAPL", "weight": 0.4},
      {"symbol": "MSFT", "weight": 0.3},
      {"symbol": "GOOGL", "weight": 0.3}
    ]
  }'
```

### Requirements:
- Weights must sum to 1.0
- Valid stock symbols
- At least 1 year of historical data available

## What Gets Calculated:

### 🎯 STEP 1: Fetch Historical Data
- Gets 1 year (252 trading days) of prices
- Uses Yahoo Finance API
- Real market data

### 📈 STEP 2: Calculate Daily Returns
- Formula: `(Today - Yesterday) / Yesterday`
- 249 returns from 250 prices

### 📊 STEP 3: Individual Stock Volatility
- Calculates standard deviation for each stock
- Annualizes: `daily σ × √252`
- Example: AAPL = 32.53%

### 🔗 STEP 4: Covariance Matrix
- Shows how stocks move together
- Accounts for correlations
- 3×3 matrix for 3 stocks

### 🎲 STEP 5: Portfolio Variance
- Matrix multiplication: `W^T × Cov × W`
- Weights × Covariances × Weights

### ✨ STEP 6: Portfolio Standard Deviation
- Final result: `√variance`
- Your portfolio's total risk
- **Lower is less risky!**

## 📚 Understanding the Results:

### Portfolio Std Dev: 24.82%
This means:
- In a typical year, returns deviate ±24.82% from average
- 68% of returns fall within ±24.82% (1 standard deviation)
- 95% fall within ±49.64% (2 standard deviations)

### Interpretation:
- **< 15%:** Low volatility (conservative portfolio)
- **15-25%:** Moderate volatility (balanced portfolio)  
- **25-35%:** High volatility (growth portfolio)
- **> 35%:** Very high volatility (aggressive/concentrated)

### Diversification Benefit:
If individual stocks average 30% volatility but portfolio is 25%, you've reduced risk by 5% through diversification!

### Correlations:
- **1.0:** Stocks move perfectly together (no diversification)
- **0.5:** Moderate correlation (some diversification benefit)
- **0.0:** Independent movement (maximum diversification)
- **-1.0:** Opposite movement (perfect hedge)

## 🎯 Use Cases:

### 1. Risk Assessment
"Is my portfolio too risky for my age/goals?"

### 2. Sharpe Ratio Calculation
Need std dev for: `(Return - Risk Free) / Std Dev`

### 3. Portfolio Optimization
Compare different portfolio combinations

### 4. Rebalancing Decisions
See if adding/removing positions changes risk

### 5. Diversification Analysis
Prove mathematically that diversification reduces risk

## 💡 Pro Tips:

1. **Lower correlation = better diversification**
   - Tech stocks (AAPL, MSFT, GOOGL) are 0.5 correlated
   - Mix sectors for lower correlation

2. **Balance risk vs. return**
   - High std dev isn't bad if returns are high too
   - Use Sharpe Ratio to compare risk-adjusted returns

3. **Update regularly**
   - Market conditions change
   - Recalculate quarterly or after major changes

4. **Consider your time horizon**
   - Long horizon = can tolerate higher std dev
   - Short horizon = need lower std dev

5. **Don't just chase low volatility**
   - Cash has 0% std dev but 0% returns
   - Goal is optimal risk-adjusted returns

## 🚀 Quick Start:

**Fastest way to try it:**
```bash
cd /Users/lucaslippman/wealthmanagement
./test_stddev.sh
```

This runs 3 test portfolios and shows their std dev instantly!

## ❓ Common Questions:

**Q: Why is my portfolio std dev lower than my individual stocks?**
A: Diversification! Stocks don't move perfectly together, so portfolio risk is lower.

**Q: What if I don't have my statement?**
A: Use the manual API call with your holdings and weights.

**Q: How accurate is this?**
A: Very accurate - uses actual historical data and proper mathematical formulas.

**Q: Can I use this for options/bonds/crypto?**
A: Only for stocks with Yahoo Finance data currently.

**Q: How often should I check this?**
A: Quarterly or after significant portfolio changes.

---

**Now you have professional-grade portfolio risk analysis! 🎉📊**



