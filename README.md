# Portfolio Performance Analyzer

A comprehensive web application designed to help retail investors evaluate their investment returns using professional portfolio management metrics. This tool empowers investors to make data-driven decisions about whether they're managing their portfolios efficiently or if they'd be better served by benchmark funds.

## 🎯 Purpose

Most retail investors lack access to the sophisticated metrics that professional portfolio managers use daily. This application bridges that gap by providing:

- **Professional Performance Metrics**: Sharpe Ratio, Treynor Ratio, Jensen's Alpha, and more
- **Benchmark Comparisons**: Compare your performance against recommended funds based on your risk tolerance
- **Educational Content**: Understand what each metric means and how to interpret your results
- **Actionable Feedback**: Get personalized recommendations based on your portfolio's performance

## 📊 Features

### ⭐ NEW: Real Portfolio Metrics from Your Holdings

Upload your brokerage statement and get **real portfolio metrics** calculated from your actual holdings:

- **Automatic Calculation**: Uploads statement → AI extracts holdings → Calculates metrics with real market data
- **Professional Analysis**: Sharpe Ratio, Jensen's Alpha, and Treynor Ratio from actual 1-year historical returns
- **True Portfolio Volatility**: Standard deviation calculated using real covariance matrix (not estimates)
- **Market Comparison**: See how your portfolio performs vs. S&P 500 with actual data
- **Holdings Breakdown**: Individual stock returns, betas, and contribution to portfolio

📖 See [REAL_PORTFOLIO_METRICS.md](./REAL_PORTFOLIO_METRICS.md) for complete documentation.

### 🎯 Core Portfolio Performance Metrics

1. **Sharpe Ratio**
   - Measures risk-adjusted returns relative to the risk-free rate
   - Formula: `(Portfolio Return - Risk-Free Rate) / Standard Deviation`
   - Higher is better (>1 is good, >2 is very good)

2. **Treynor Ratio**
   - Measures excess return per unit of systematic risk (beta)
   - Formula: `(Portfolio Return - Risk-Free Rate) / Beta`
   - Best for comparing diversified portfolios

3. **Jensen's Alpha**
   - Indicates value added through portfolio management
   - Formula: `Portfolio Return - [Risk-Free Rate + (Market Return - Risk-Free Rate) × Beta]`
   - Positive alpha = outperforming the market

4. **Future Value Projection**
   - Projects portfolio growth over time
   - Formula: `Present Value × (1 + Return Rate)^Years`
   - Useful for retirement and goal planning

5. **Dollar-Weighted Returns**
   - Accounts for timing and size of cash flows
   - Measures YOUR actual performance as an investor

6. **Time-Weighted Returns**
   - Excludes cash flow effects
   - Measures pure investment performance (manager's skill)

### 📈 Visual Analytics

1. **Interactive Performance Charts**
   - Bar charts comparing your metrics to benchmarks
   - Line charts showing future value growth projections
   - Radar charts displaying risk-return profiles
   - Color-coded performance indicators

2. **Cash Flow Tracker**
   - Add unlimited deposits and withdrawals
   - Track investment timing impact
   - Visual summaries of total contributions
   - Real-time DWR and TWR calculations

3. **Export & Share**
   - Download detailed text reports
   - Print-friendly formatted output
   - Share via native share API or clipboard
   - Save analysis for financial advisor review

### 💡 Benchmark Comparisons

The application recommends funds based on four risk tolerance levels:

#### Ultra Conservative (20-30% Equities)
- **VASIX** - Vanguard LifeStrategy Income Fund (20% Equities, 80% Bonds)
- **AOK** - iShares Core Conservative Allocation ETF (30% Equities, 70% Bonds)

#### Conservative (40% Equities)
- **VSCGX** - Vanguard LifeStrategy Conservative Growth Fund (40% Equities, 60% Bonds)
- **AOM** - iShares Core Moderate Allocation ETF (40% Equities, 60% Bonds)

#### Moderate (60% Equities)
- **VSMGX** - Vanguard LifeStrategy Moderate Growth Fund (60% Equities, 40% Bonds)
- **AOR** - iShares Core Growth Allocation ETF (60% Equities, 40% Bonds)

#### Aggressive (80% Equities)
- **VASGX** - Vanguard LifeStrategy Growth Fund (80% Equities, 20% Bonds)
- **AOA** - iShares Core Aggressive Allocation ETF (80% Equities, 20% Bonds)

## 🚀 Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
cd wealthmanagement
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 🎨 Technology Stack

- **React 18** - Modern UI framework with hooks
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework for beautiful, responsive design
- **Recharts** - Professional charting library for data visualization
- **Lucide React** - Modern, customizable icon library
- **JavaScript ES6+** - Modern JavaScript features

## 📖 How to Use

### Quick Start: Upload Statement for Automatic Analysis

1. **Upload Your Brokerage Statement**
   - Click "Upload Brokerage Statement" section
   - Upload screenshot or PDF
   - Gemini AI extracts holdings automatically

2. **Automatic Metrics Calculation**
   - App fetches 1-year historical data for each stock
   - Calculates real Sharpe Ratio, Jensen's Alpha, Treynor Ratio
   - Shows portfolio volatility and beta from actual data

3. **Review Your Results**
   - See color-coded performance ratings
   - Compare to S&P 500 benchmark
   - Get personalized recommendations

### Manual Entry: Calculate with Custom Data

### Step 1: Enter Portfolio Data
- Portfolio return (annual percentage)
- Risk-free rate (current T-Bill rate, defaults to 4.5%)
- Portfolio standard deviation (volatility measure)
- Portfolio beta (systematic risk, market = 1.0)
- Market return (S&P 500 benchmark)
- Risk tolerance level (Ultra Conservative → Aggressive)

### Step 2: Add Future Value Projection (Optional)
- Initial investment amount
- Investment time horizon in years

### Step 3: Calculate & Review Metrics
- View all performance metrics with color-coded ratings
- See interactive charts and visualizations
- Get personalized feedback and recommendations
- Compare against market benchmarks

### Step 4: Analyze Cash Flows (Advanced)
- Track deposits and withdrawals with dates
- Calculate Dollar-Weighted Returns (your actual return)
- Calculate Time-Weighted Returns (investment performance)
- Understand how timing affected your results

### Step 5: Export & Save
- Download detailed text report
- Print for financial advisor meetings
- Share results or copy to clipboard

### Step 6: Learn & Improve
- Expand educational sections
- Understand each metric in depth
- Apply investment principles
- Make data-driven decisions

## 🎓 Key Insights for Investors

### When to Consider Benchmark Funds

You may benefit from switching to low-cost benchmark funds if:

- Your Sharpe Ratio is consistently below 1.0
- Your Jensen's Alpha is negative
- You're paying high fees (>0.5% for stock funds, >0.3% for bond funds)
- You don't have time for active portfolio management
- Your portfolio lacks proper diversification

### Benefits of Benchmark Funds

1. **Lower Costs** - Expense ratios typically under 0.20%
2. **Instant Diversification** - Thousands of securities in one fund
3. **Automatic Rebalancing** - Maintains target allocation
4. **Tax Efficiency** - Lower turnover = fewer taxable events
5. **Simplicity** - Easy to manage with minimal time commitment

### Investment Principles

1. **Fees Matter** - A 1% annual fee can cost hundreds of thousands over a lifetime
2. **Diversification is Key** - Don't put all eggs in one basket
3. **Time in Market > Timing the Market** - Consistent investing beats market timing
4. **Rebalance Regularly** - Maintain your target asset allocation
5. **Know Your Risk Tolerance** - Choose investments you can stick with long-term

## 📝 Important Notes

### Data Privacy
All calculations are performed client-side in your browser. No portfolio data is sent to any server or stored anywhere. Your financial information remains completely private.

### Disclaimer
This tool is for educational purposes only and does not constitute financial advice. Past performance does not guarantee future results. Always consult with a qualified financial advisor before making investment decisions.

### Calculation Assumptions

- **Sharpe and Treynor Ratios**: Assume returns and risk measures are based on the same time period
- **Jensen's Alpha**: Uses the Capital Asset Pricing Model (CAPM)
- **Future Value**: Assumes constant annual returns (actual returns will vary)
- **Dollar-Weighted Returns**: Uses Internal Rate of Return (IRR) methodology
- **Time-Weighted Returns**: Geometric mean of period returns

## 🤝 Contributing

This is an educational project designed to help retail investors. Suggestions for improvements are welcome!

## 📄 License

This project is open source and available for educational use.

## 🙏 Acknowledgments

Built with the goal of democratizing access to professional portfolio analysis tools for retail investors everywhere.

---

**Remember**: The best investment strategy is one you can stick with through market ups and downs. Use these metrics as tools to inform your decisions, not as absolute rules.

