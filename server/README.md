# Yahoo Finance API Server

Backend Express server that provides real-time market data from Yahoo Finance.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm start
```

The server will run on **http://localhost:3001**

## 📡 API Endpoints

### 1. Get Stock Quote
```
GET /api/quote/:symbol
```
Example: `http://localhost:3001/api/quote/AAPL`

Returns current price, change, volume, and other quote data.

### 2. Get Historical Data
```
GET /api/historical/:symbol?period=1y
```
Example: `http://localhost:3001/api/historical/AAPL?period=1y`

Returns historical data with calculated returns. Periods: `1y`, `3y`, `5y`

### 3. Get Market Data
```
GET /api/market-data
```
Example: `http://localhost:3001/api/market-data`

Returns S&P 500 data and current T-Bill rate.

### 4. Get Benchmark Funds
```
GET /api/benchmark-funds
```
Example: `http://localhost:3001/api/benchmark-funds`

Returns data for all 8 benchmark funds (VASIX, AOK, VSCGX, AOM, VSMGX, AOR, VASGX, AOA).

### 5. Get Stock Info (with Beta)
```
GET /api/stock-info/:symbol
```
Example: `http://localhost:3001/api/stock-info/AAPL`

Returns detailed stock information including beta.

### 6. Calculate Portfolio Beta
```
POST /api/portfolio-beta
Content-Type: application/json

{
  "holdings": [
    { "symbol": "AAPL", "weight": 0.5 },
    { "symbol": "MSFT", "weight": 0.5 }
  ]
}
```

Returns weighted portfolio beta based on holdings.

### 7. Health Check
```
GET /health
```
Example: `http://localhost:3001/health`

Returns server health status.

## 🧪 Testing

### Test with cURL

```bash
# Get AAPL quote
curl http://localhost:3001/api/quote/AAPL

# Get market data
curl http://localhost:3001/api/market-data

# Get Tesla stock info
curl http://localhost:3001/api/stock-info/TSLA

# Test health
curl http://localhost:3001/health
```

### Test in Browser

Simply open these URLs:
- http://localhost:3001/api/quote/AAPL
- http://localhost:3001/api/quote/MSFT
- http://localhost:3001/api/quote/GOOGL
- http://localhost:3001/api/market-data
- http://localhost:3001/api/benchmark-funds

## 📦 Dependencies

- **express** - Web server framework
- **cors** - Enable CORS for frontend communication
- **yahoo-finance2** - Yahoo Finance API wrapper

## ⚙️ Configuration

The server runs on port **3001** by default. You can change this in `index.js`:

```javascript
const PORT = 3001; // Change this to your preferred port
```

## 🔒 CORS

CORS is enabled for all origins. In production, you should restrict this:

```javascript
app.use(cors({
  origin: 'http://your-frontend-domain.com'
}));
```

## 📝 Notes

- This uses the **unofficial** Yahoo Finance API
- Rate limits may apply
- Data is fetched in real-time
- Some stocks may not have all data available
- Historical data requires at least 2 data points

## 🐛 Troubleshooting

### Server won't start
- Make sure port 3001 is not in use
- Run `npm install` to install dependencies

### Can't fetch data for a symbol
- Check if the symbol is valid
- Some delisted stocks won't have data
- Try a different symbol (AAPL, MSFT, etc.)

### CORS errors
- Make sure the server is running
- Check that frontend is making requests to correct URL
- Verify CORS is enabled in server code

## 🚀 Production Deployment

For production:

1. Add environment variables for configuration
2. Implement rate limiting
3. Add caching layer (Redis)
4. Restrict CORS to your domain
5. Add authentication if needed
6. Use process manager (PM2)

Example PM2 start:
```bash
pm2 start index.js --name yahoo-finance-api
```

## 📄 License

MIT - Same as main project



