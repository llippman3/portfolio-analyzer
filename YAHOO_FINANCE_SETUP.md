# 🔥 Yahoo Finance Integration Setup Guide

This guide will help you set up the Yahoo Finance backend server for real-time market data.

## 📋 Prerequisites

- Node.js 18.20.4 or higher
- npm (comes with Node.js)

## 🚀 Quick Setup (2 Steps)

### Step 1: Install Backend Dependencies

```bash
cd server
npm install
```

This installs:
- `express` - Web server
- `cors` - Cross-origin support
- `yahoo-finance2` - Yahoo Finance API

### Step 2: Start Both Servers

From the **root directory**, open **two terminals**:

**Terminal 1** - Backend Server:
```bash
cd server
npm start
```

You should see:
```
🚀 Yahoo Finance API Server running on http://localhost:3001
📊 Available endpoints:
   - GET  /api/quote/:symbol
   - GET  /api/historical/:symbol
   ...
💡 Test with: http://localhost:3001/api/quote/AAPL
```

**Terminal 2** - Frontend (from root):
```bash
npm run dev
```

You should see:
```
VITE v5.4.20  ready in 304 ms
➜  Local:   http://localhost:5173/
```

## ✅ Verify Setup

### Test Backend

Open these URLs in your browser:

1. **Health Check**: http://localhost:3001/health
   - Should return: `{"status":"ok","timestamp":"..."}`

2. **Test AAPL Quote**: http://localhost:3001/api/quote/AAPL
   - Should return Apple stock data with price, change, etc.

3. **Market Data**: http://localhost:3001/api/market-data
   - Should return S&P 500 and T-Bill rate

### Test Frontend

1. Open http://localhost:5173
2. Look for **"Live Market Data"** section at top
3. Should show green dot 🟢 indicating server is online
4. Should display S&P 500 price and T-Bill rate
5. Click **"Refresh"** to fetch latest data
6. Click **"Auto-Fill Form with Live Data"** to populate the form

## 🎯 Test with Stock Symbols

Try the **Stock Quote Lookup** section:

1. Click any quick button: **AAPL**, **MSFT**, **GOOGL**, **TSLA**, etc.
2. Or type a symbol and click **Search**
3. See real-time price, change %, day range, 52-week range
4. If available, see **Beta** value for the stock

### Recommended Test Symbols

- **AAPL** - Apple (large cap tech)
- **MSFT** - Microsoft (large cap tech)
- **TSLA** - Tesla (high beta/volatile)
- **JNJ** - Johnson & Johnson (low beta/stable)
- **SPY** - S&P 500 ETF
- **QQQ** - Nasdaq 100 ETF

## 🎨 Features Enabled

Once both servers are running:

### ✅ Live Market Data Widget
- Real-time S&P 500 price and daily change
- Current 13-week T-Bill rate (risk-free rate)
- One-click auto-fill for portfolio form
- Refresh button for latest data
- Server status indicator (🟢 online / 🔴 offline)

### ✅ Stock Quote Lookup
- Search any stock symbol
- Real-time price and changes
- Day high/low and 52-week range
- Market cap
- Beta (if available) with volatility indicator
- Quick access to popular stocks

### ✅ Auto-Fill Portfolio Form
1. Click **"Auto-Fill Form with Live Data"** button
2. Market Return field fills with S&P 500 1-year return
3. Risk-Free Rate fills with current T-Bill rate
4. Enter your other portfolio data manually
5. Calculate metrics with real market data!

## 🔧 Alternative: Single Command

You can also run both servers with one command:

```bash
npm run dev:all
```

This starts both the backend and frontend simultaneously.

## 🐛 Troubleshooting

### Backend Server Issues

**Port 3001 already in use:**
```bash
# Find and kill process on port 3001 (Mac/Linux)
lsof -ti:3001 | xargs kill -9

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

**Dependencies not installed:**
```bash
cd server
rm -rf node_modules package-lock.json
npm install
```

### Frontend Issues

**"Live Market Data Offline" message:**
- Backend server not running
- Check Terminal 1 for errors
- Restart backend: `cd server && npm start`

**CORS errors in browser console:**
- Make sure backend is running on port 3001
- Check that frontend is calling `http://localhost:3001/api/...`
- Clear browser cache and reload

**Data not loading:**
- Check internet connection (Yahoo Finance requires internet)
- Some symbols may be invalid or delisted
- Try a known symbol like AAPL or MSFT

### Yahoo Finance API Issues

**Rate limiting:**
- Yahoo may rate limit excessive requests
- Wait a few minutes before trying again
- Consider adding caching in production

**Symbol not found:**
- Check symbol is valid on Yahoo Finance
- Some stocks may be delisted
- Try searching on finance.yahoo.com first

## 📊 API Examples

### cURL Examples

```bash
# Get Apple stock quote
curl http://localhost:3001/api/quote/AAPL

# Get Tesla 1-year performance
curl http://localhost:3001/api/historical/TSLA?period=1y

# Get current market data
curl http://localhost:3001/api/market-data

# Get all benchmark funds
curl http://localhost:3001/api/benchmark-funds

# Get Microsoft with beta
curl http://localhost:3001/api/stock-info/MSFT
```

### JavaScript Fetch Examples

```javascript
// Get quote
const quote = await fetch('http://localhost:3001/api/quote/AAPL')
  .then(r => r.json());
console.log(quote.data.price);

// Get market data
const market = await fetch('http://localhost:3001/api/market-data')
  .then(r => r.json());
console.log(market.data.sp500.yearReturn);
```

## 🚀 Usage Tips

1. **Auto-fill is smart**: It fetches the S&P 500's actual 1-year return and current T-Bill rate
2. **Stock lookup for beta**: Look up your holdings to get their beta values
3. **Refresh data**: Click refresh before making important decisions
4. **Quick symbols**: Use quick buttons to test popular stocks
5. **Bookmark API**: http://localhost:3001/api/quote/YOUR_SYMBOL

## 📈 What Data You Get

### S&P 500 (^GSPC)
- Current index value
- Daily change and % change
- **1-year return** (for market return input)

### T-Bill Rate (^IRX)
- 13-week Treasury Bill rate
- Used as risk-free rate

### Individual Stocks
- Current price
- Daily change
- Day high/low
- 52-week high/low
- Market cap
- Volume
- **Beta** (systematic risk)

### Benchmark Funds
All 8 funds with:
- Current price
- Daily performance
- 1-year returns
- Real-time updates

## 🎓 Understanding the Data

### Beta Values
- **Beta = 1.0**: Moves with the market
- **Beta > 1.0**: More volatile than market (e.g., TSLA ~2.0)
- **Beta < 1.0**: Less volatile than market (e.g., JNJ ~0.5)

### Market Return
- S&P 500 1-year return is calculated from historical data
- Updated in real-time
- Use this as your market benchmark

### Risk-Free Rate
- 13-week T-Bill rate
- Currently around 4-5%
- Changes based on Fed policy

## 🎉 You're All Set!

You now have:
- ✅ Real-time market data
- ✅ Stock quote lookup
- ✅ Auto-fill functionality
- ✅ Live benchmark fund prices
- ✅ Beta calculations
- ✅ Professional-grade data sources

Start analyzing your portfolio with real market data! 🚀📈

## 💡 Next Steps

1. Test with AAPL to see it working
2. Look up your actual holdings
3. Use auto-fill to populate the form
4. Calculate your portfolio metrics
5. Compare with benchmark funds using real data

---

**Need Help?** Check the main README.md or open an issue on GitHub.



