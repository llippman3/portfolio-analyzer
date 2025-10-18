import express from 'express';
import cors from 'cors';
import yahooFinance from 'yahoo-finance2';
import { GoogleGenerativeAI } from '@google/generative-ai';
import multer from 'multer';
import fs from 'fs';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Initialize Gemini AI (user will need to set API key)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_API_KEY_HERE';
let genAI = null;

if (GEMINI_API_KEY && GEMINI_API_KEY !== 'YOUR_API_KEY_HERE') {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
}

// Middleware
app.use(cors());
app.use(express.json());

// Enable error handling for yahoo-finance2
yahooFinance.suppressNotices(['yahooSurvey']);

/**
 * GET /api/quote/:symbol
 * Get real-time quote for a stock symbol
 */
app.get('/api/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const quote = await yahooFinance.quote(symbol);
    
    res.json({
      success: true,
      data: {
        symbol: quote.symbol,
        price: quote.regularMarketPrice,
        change: quote.regularMarketChange,
        changePercent: quote.regularMarketChangePercent,
        dayHigh: quote.regularMarketDayHigh,
        dayLow: quote.regularMarketDayLow,
        volume: quote.regularMarketVolume,
        fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
        fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
        currency: quote.currency,
        marketCap: quote.marketCap,
        shortName: quote.shortName,
        longName: quote.longName
      }
    });
  } catch (error) {
    console.error(`Error fetching quote for ${req.params.symbol}:`, error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/historical/:symbol
 * Get historical data for calculating returns
 */
app.get('/api/historical/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { period = '1y' } = req.query;
    
    // Calculate dates for the period
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      case '3y':
        startDate.setFullYear(endDate.getFullYear() - 3);
        break;
      case '5y':
        startDate.setFullYear(endDate.getFullYear() - 5);
        break;
      default:
        startDate.setFullYear(endDate.getFullYear() - 1);
    }
    
    const queryOptions = {
      period1: startDate,
      period2: endDate,
      interval: '1d'
    };
    
    const result = await yahooFinance.historical(symbol, queryOptions);
    
    if (result && result.length >= 2) {
      const oldestPrice = result[0].close;
      const latestPrice = result[result.length - 1].close;
      const returnPercent = ((latestPrice - oldestPrice) / oldestPrice) * 100;
      
      res.json({
        success: true,
        data: {
          symbol,
          period,
          startPrice: oldestPrice,
          endPrice: latestPrice,
          return: returnPercent,
          dataPoints: result.length,
          startDate: result[0].date,
          endDate: result[result.length - 1].date
        }
      });
    } else {
      throw new Error('Insufficient historical data');
    }
  } catch (error) {
    console.error(`Error fetching historical data for ${req.params.symbol}:`, error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/market-data
 * Get comprehensive market data including S&P 500 (SPY) and T-Bill rate
 */
app.get('/api/market-data', async (req, res) => {
  try {
    // Fetch SPY (S&P 500 ETF) data - more commonly used than ^GSPC
    const spyQuote = await yahooFinance.quote('SPY');
    
    // Fetch SPY 1-year historical for return calculation
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1);
    
    const spyHistory = await yahooFinance.historical('SPY', {
      period1: startDate,
      period2: endDate,
      interval: '1d'
    });
    
    let marketReturn = 10; // Default fallback
    if (spyHistory && spyHistory.length >= 2) {
      const oldPrice = spyHistory[0].close;
      const newPrice = spyHistory[spyHistory.length - 1].close;
      marketReturn = ((newPrice - oldPrice) / oldPrice) * 100;
    }
    
    // Fetch 13-week T-Bill rate (^IRX)
    let riskFreeRate = 4.5; // Default fallback
    try {
      const tbillQuote = await yahooFinance.quote('^IRX');
      riskFreeRate = tbillQuote.regularMarketPrice || 4.5;
    } catch (e) {
      console.log('T-Bill rate not available, using default');
    }
    
    res.json({
      success: true,
      data: {
        sp500: {
          price: spyQuote.regularMarketPrice,
          change: spyQuote.regularMarketChange,
          changePercent: spyQuote.regularMarketChangePercent,
          yearReturn: marketReturn
        },
        riskFreeRate: riskFreeRate,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching market data:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/benchmark-funds
 * Get data for all benchmark funds
 */
app.get('/api/benchmark-funds', async (req, res) => {
  try {
    const funds = ['VASIX', 'AOK', 'VSCGX', 'AOM', 'VSMGX', 'AOR', 'VASGX', 'AOA'];
    
    const fundPromises = funds.map(async (symbol) => {
      try {
        const quote = await yahooFinance.quote(symbol);
        
        // Get 1-year historical data
        const endDate = new Date();
        const startDate = new Date();
        startDate.setFullYear(endDate.getFullYear() - 1);
        
        const history = await yahooFinance.historical(symbol, {
          period1: startDate,
          period2: endDate,
          interval: '1d'
        });
        
        let yearReturn = null;
        if (history && history.length >= 2) {
          const oldPrice = history[0].close;
          const newPrice = history[history.length - 1].close;
          yearReturn = ((newPrice - oldPrice) / oldPrice) * 100;
        }
        
        return {
          symbol,
          price: quote.regularMarketPrice,
          change: quote.regularMarketChange,
          changePercent: quote.regularMarketChangePercent,
          yearReturn,
          currency: quote.currency,
          name: quote.shortName || quote.longName
        };
      } catch (error) {
        console.error(`Error fetching ${symbol}:`, error.message);
        return {
          symbol,
          error: error.message
        };
      }
    });
    
    const results = await Promise.all(fundPromises);
    
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error fetching benchmark funds:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/stock-info/:symbol
 * Get detailed stock information
 */
app.get('/api/stock-info/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    const [quote, quoteSummary] = await Promise.all([
      yahooFinance.quote(symbol),
      yahooFinance.quoteSummary(symbol, {
        modules: ['summaryDetail', 'defaultKeyStatistics', 'price']
      }).catch(() => null) // Some stocks may not have all modules
    ]);
    
    res.json({
      success: true,
      data: {
        quote,
        summary: quoteSummary,
        beta: quoteSummary?.defaultKeyStatistics?.beta || null
      }
    });
  } catch (error) {
    console.error(`Error fetching stock info for ${req.params.symbol}:`, error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/portfolio-beta
 * Calculate portfolio beta from holdings
 */
app.post('/api/portfolio-beta', async (req, res) => {
  try {
    const { holdings } = req.body; // Array of { symbol, weight }
    
    if (!holdings || !Array.isArray(holdings)) {
      return res.status(400).json({
        success: false,
        error: 'Holdings must be an array of { symbol, weight }'
      });
    }
    
    const betaPromises = holdings.map(async (holding) => {
      try {
        const summary = await yahooFinance.quoteSummary(holding.symbol, {
          modules: ['defaultKeyStatistics']
        });
        
        return {
          symbol: holding.symbol,
          weight: holding.weight,
          beta: summary.defaultKeyStatistics?.beta || 1.0
        };
      } catch (error) {
        console.error(`Error fetching beta for ${holding.symbol}:`, error.message);
        return {
          symbol: holding.symbol,
          weight: holding.weight,
          beta: 1.0 // Default to market beta
        };
      }
    });
    
    const results = await Promise.all(betaPromises);
    
    // Calculate weighted portfolio beta
    const portfolioBeta = results.reduce((sum, item) => {
      return sum + (item.beta * item.weight);
    }, 0);
    
    res.json({
      success: true,
      data: {
        portfolioBeta,
        holdings: results
      }
    });
  } catch (error) {
    console.error('Error calculating portfolio beta:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/parse-statement
 * Parse financial statement using Gemini AI
 */
app.post('/api/parse-statement', upload.single('statement'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    if (!genAI) {
      return res.status(500).json({
        success: false,
        error: 'Gemini API key not configured. Set GEMINI_API_KEY environment variable.'
      });
    }

    // Read the uploaded file
    const imageData = fs.readFileSync(req.file.path);
    const base64Image = imageData.toString('base64');

    // Use Gemini 2.5 Flash-Lite for fast, efficient parsing
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const prompt = `You are a financial statement parser. Analyze this brokerage statement image and extract the following information in JSON format:

{
  "totalValue": <total portfolio value as number>,
  "totalCostBasis": <total cost basis as number>,
  "unrealizedGainLoss": <unrealized gain/loss as number>,
  "unrealizedGainLossPercent": <unrealized gain/loss percentage as number>,
  "incomeEarned": <total dividends/income earned as number>,
  "holdings": [
    {
      "symbol": "<stock symbol>",
      "shares": <number of shares>,
      "costBasis": <cost basis per share>,
      "currentPrice": <current price>,
      "totalValue": <total value of holding>,
      "gainLoss": <gain/loss amount>,
      "gainLossPercent": <gain/loss percentage>
    }
  ],
  "accountInfo": {
    "accountNumber": "<account number if visible, mask most digits>",
    "accountType": "<type of account, e.g., Individual, IRA, 401k>",
    "statementDate": "<date of statement>"
  }
}

IMPORTANT:
- Extract all numeric values as numbers (no $ or % symbols)
- If a value is not visible or cannot be determined, use null
- Be precise with the numbers
- Include all visible holdings
- Calculate totals if they're not explicitly shown`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: req.file.mimetype,
          data: base64Image
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    let parsedData;
    try {
      // Remove markdown code blocks if present
      const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedData = JSON.parse(jsonText);
    } catch (parseError) {
      // If JSON parsing fails, return the raw text
      parsedData = { rawResponse: text };
    }

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      data: parsedData
    });

  } catch (error) {
    console.error('Error parsing statement:', error.message);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/calculate-portfolio-stddev
 * Calculate portfolio standard deviation using historical data
 */
app.post('/api/calculate-portfolio-stddev', async (req, res) => {
  try {
    const { holdings } = req.body; // [{symbol, weight}]
    
    if (!holdings || !Array.isArray(holdings)) {
      return res.status(400).json({
        success: false,
        error: 'Holdings array required: [{symbol, weight}]'
      });
    }

    // Validate weights sum to 1
    const totalWeight = holdings.reduce((sum, h) => sum + h.weight, 0);
    if (Math.abs(totalWeight - 1.0) > 0.01) {
      return res.status(400).json({
        success: false,
        error: `Weights must sum to 1.0 (currently: ${totalWeight.toFixed(3)})`
      });
    }

    console.log(`\n📊 STEP 1: Fetching historical data for ${holdings.length} stocks...`);
    
    // STEP 1: Fetch historical price data for all stocks (1 year = 252 trading days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1);
    
    const historicalDataPromises = holdings.map(async (holding) => {
      try {
        console.log(`  Fetching ${holding.symbol}...`);
        const history = await yahooFinance.historical(holding.symbol, {
          period1: startDate,
          period2: endDate,
          interval: '1d'
        });
        
        const prices = history.map(h => h.close);
        console.log(`  ✓ ${holding.symbol}: ${prices.length} days of data`);
        
        return {
          symbol: holding.symbol,
          weight: holding.weight,
          prices: prices,
          dates: history.map(h => h.date)
        };
      } catch (error) {
        console.error(`  ✗ Error fetching ${holding.symbol}:`, error.message);
        return null;
      }
    });
    
    const stocksData = (await Promise.all(historicalDataPromises)).filter(d => d !== null);
    
    if (stocksData.length === 0) {
      throw new Error('Failed to fetch data for any stocks');
    }
    
    console.log(`✓ STEP 1 Complete: Fetched data for ${stocksData.length} stocks\n`);
    
    // STEP 2: Calculate daily returns for all stocks
    console.log('📊 STEP 2: Calculating daily returns...');
    const stocksWithReturns = stocksData.map(stock => {
      const returns = [];
      for (let i = 1; i < stock.prices.length; i++) {
        const dailyReturn = (stock.prices[i] - stock.prices[i - 1]) / stock.prices[i - 1];
        returns.push(dailyReturn);
      }
      console.log(`  ${stock.symbol}: ${returns.length} daily returns`);
      return {
        ...stock,
        returns: returns
      };
    });
    console.log(`✓ STEP 2 Complete\n`);
    
    // STEP 3: Calculate standard deviation for each stock
    console.log('📊 STEP 3: Calculating standard deviations...');
    const stocksWithStats = stocksWithReturns.map(stock => {
      // Calculate mean
      const mean = stock.returns.reduce((sum, r) => sum + r, 0) / stock.returns.length;
      
      // Calculate variance
      const squaredDiffs = stock.returns.map(r => Math.pow(r - mean, 2));
      const variance = squaredDiffs.reduce((sum, sd) => sum + sd, 0) / (stock.returns.length - 1);
      
      // Daily standard deviation
      const dailyStdDev = Math.sqrt(variance);
      
      // Annualized standard deviation (multiply by √252)
      const annualizedStdDev = dailyStdDev * Math.sqrt(252);
      
      console.log(`  ${stock.symbol}: σ = ${(annualizedStdDev * 100).toFixed(2)}%`);
      
      return {
        ...stock,
        mean: mean,
        dailyStdDev: dailyStdDev,
        annualizedStdDev: annualizedStdDev,
        variance: variance
      };
    });
    console.log(`✓ STEP 3 Complete\n`);
    
    // STEP 4: Build covariance matrix
    console.log('📊 STEP 4: Building covariance matrix...');
    const n = stocksWithStats.length;
    const covarianceMatrix = Array(n).fill(0).map(() => Array(n).fill(0));
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) {
          // Diagonal: variance of stock i
          covarianceMatrix[i][j] = Math.pow(stocksWithStats[i].annualizedStdDev, 2);
        } else if (j > i) {
          // Upper triangle: calculate covariance
          const stock1 = stocksWithStats[i];
          const stock2 = stocksWithStats[j];
          
          let covariance = 0;
          const minLength = Math.min(stock1.returns.length, stock2.returns.length);
          
          for (let k = 0; k < minLength; k++) {
            covariance += (stock1.returns[k] - stock1.mean) * (stock2.returns[k] - stock2.mean);
          }
          covariance = covariance / (minLength - 1);
          
          // Annualize the covariance
          covariance = covariance * 252;
          
          covarianceMatrix[i][j] = covariance;
          covarianceMatrix[j][i] = covariance; // Mirror to lower triangle
        }
      }
    }
    
    console.log('  Covariance Matrix:');
    covarianceMatrix.forEach((row, i) => {
      const rowStr = row.map(v => v.toFixed(6)).join('  ');
      console.log(`  [${stocksWithStats[i].symbol}] ${rowStr}`);
    });
    console.log(`✓ STEP 4 Complete\n`);
    
    // STEP 5: Calculate portfolio variance (W^T × Cov × W)
    console.log('📊 STEP 5: Calculating portfolio variance...');
    const weights = stocksWithStats.map(s => s.weight);
    
    let portfolioVariance = 0;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        portfolioVariance += weights[i] * covarianceMatrix[i][j] * weights[j];
      }
    }
    
    console.log(`  Portfolio Variance: ${portfolioVariance.toFixed(6)}`);
    console.log(`✓ STEP 5 Complete\n`);
    
    // STEP 6: Calculate portfolio standard deviation
    console.log('📊 STEP 6: Calculating portfolio standard deviation...');
    const portfolioStdDev = Math.sqrt(portfolioVariance);
    
    console.log(`  Portfolio Standard Deviation: ${(portfolioStdDev * 100).toFixed(2)}%`);
    console.log(`✓ STEP 6 Complete\n`);
    
    // Calculate correlation matrix for additional insights
    const correlationMatrix = Array(n).fill(0).map(() => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) {
          correlationMatrix[i][j] = 1.0;
        } else {
          const correlation = covarianceMatrix[i][j] / 
            (stocksWithStats[i].annualizedStdDev * stocksWithStats[j].annualizedStdDev);
          correlationMatrix[i][j] = correlation;
        }
      }
    }
    
    res.json({
      success: true,
      data: {
        portfolioStdDev: portfolioStdDev,
        portfolioStdDevPercent: portfolioStdDev * 100,
        portfolioVariance: portfolioVariance,
        stocks: stocksWithStats.map(s => ({
          symbol: s.symbol,
          weight: s.weight,
          annualizedStdDev: s.annualizedStdDev,
          annualizedStdDevPercent: s.annualizedStdDev * 100,
          meanReturn: s.mean,
          dataPoints: s.returns.length
        })),
        covarianceMatrix: covarianceMatrix,
        correlationMatrix: correlationMatrix,
        calculation: {
          step1: `Fetched ${stocksWithStats[0].prices.length} days of historical data`,
          step2: `Calculated ${stocksWithStats[0].returns.length} daily returns`,
          step3: `Computed annualized standard deviations`,
          step4: `Built ${n}x${n} covariance matrix`,
          step5: `Computed portfolio variance: ${portfolioVariance.toFixed(6)}`,
          step6: `Computed portfolio std dev: ${(portfolioStdDev * 100).toFixed(2)}%`
        }
      }
    });
    
  } catch (error) {
    console.error('Error calculating portfolio std dev:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/calculate-portfolio-metrics
 * Calculate comprehensive portfolio metrics from holdings (Sharpe, Treynor, Jensen's Alpha, etc.)
 */
app.post('/api/calculate-portfolio-metrics', async (req, res) => {
  try {
    const { holdings, totalValue, totalCostBasis } = req.body;

    if (!holdings || !Array.isArray(holdings)) {
      return res.status(400).json({
        success: false,
        error: 'Holdings array is required'
      });
    }

    console.log(`\n🎯 Calculating comprehensive portfolio metrics for ${holdings.length} holdings...`);
    
    // STEP 1: Get market data (S&P 500 return and risk-free rate)
    console.log('📊 STEP 1: Fetching market data...');
    let marketReturn = 0.10; // 10% default
    let riskFreeRate = 0.045; // 4.5% default
    
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setFullYear(endDate.getFullYear() - 1);
      
      const spyHistory = await yahooFinance.historical('SPY', {
        period1: startDate,
        period2: endDate,
        interval: '1d'
      });
      
      if (spyHistory && spyHistory.length >= 2) {
        const oldPrice = spyHistory[0].close;
        const newPrice = spyHistory[spyHistory.length - 1].close;
        marketReturn = (newPrice - oldPrice) / oldPrice;
      }
      
      // Try to get T-Bill rate
      try {
        const tbillQuote = await yahooFinance.quote('^IRX');
        riskFreeRate = (tbillQuote.regularMarketPrice || 4.5) / 100;
      } catch (e) {
        console.log('  Using default T-Bill rate');
      }
      
      console.log(`  ✓ Market Return: ${(marketReturn * 100).toFixed(2)}%`);
      console.log(`  ✓ Risk-Free Rate: ${(riskFreeRate * 100).toFixed(2)}%`);
    } catch (error) {
      console.log('  Using default market data');
    }

    // STEP 2: Calculate portfolio weights and get historical data
    console.log('\n📊 STEP 2: Calculating portfolio weights and fetching historical data...');
    const portfolioTotalValue = totalValue || holdings.reduce((sum, h) => sum + (h.totalValue || 0), 0);
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1);
    
    const holdingsDataPromises = holdings.map(async (holding) => {
      try {
        const weight = (holding.totalValue || 0) / portfolioTotalValue;
        
        // Get historical data for return calculation
        const history = await yahooFinance.historical(holding.symbol, {
          period1: startDate,
          period2: endDate,
          interval: '1d'
        });
        
        let stockReturn = 0;
        if (history && history.length >= 2) {
          const oldPrice = history[0].close;
          const newPrice = history[history.length - 1].close;
          stockReturn = (newPrice - oldPrice) / oldPrice;
        }
        
        // Get beta
        let beta = 1.0;
        try {
          const summary = await yahooFinance.quoteSummary(holding.symbol, {
            modules: ['defaultKeyStatistics']
          });
          beta = summary.defaultKeyStatistics?.beta || 1.0;
        } catch (e) {
          console.log(`  Using default beta for ${holding.symbol}`);
        }
        
        console.log(`  ✓ ${holding.symbol}: ${(weight * 100).toFixed(2)}% weight, ${(stockReturn * 100).toFixed(2)}% return, β=${beta.toFixed(2)}`);
        
        return {
          symbol: holding.symbol,
          weight: weight,
          totalValue: holding.totalValue,
          stockReturn: stockReturn,
          beta: beta,
          prices: history.map(h => h.close)
        };
      } catch (error) {
        console.error(`  ✗ Error fetching data for ${holding.symbol}:`, error.message);
        return null;
      }
    });
    
    const holdingsData = (await Promise.all(holdingsDataPromises)).filter(d => d !== null);
    
    if (holdingsData.length === 0) {
      throw new Error('Failed to fetch data for any holdings');
    }

    // STEP 3: Calculate portfolio beta (weighted average)
    console.log('\n📊 STEP 3: Calculating portfolio beta...');
    const portfolioBeta = holdingsData.reduce((sum, h) => sum + (h.beta * h.weight), 0);
    console.log(`  ✓ Portfolio Beta: ${portfolioBeta.toFixed(3)}`);

    // STEP 4: Calculate portfolio return (weighted average of stock returns)
    console.log('\n📊 STEP 4: Calculating portfolio return...');
    const portfolioReturn = holdingsData.reduce((sum, h) => sum + (h.stockReturn * h.weight), 0);
    console.log(`  ✓ Portfolio Return (1-year): ${(portfolioReturn * 100).toFixed(2)}%`);

    // STEP 5: Calculate portfolio standard deviation
    console.log('\n📊 STEP 5: Calculating portfolio standard deviation...');
    
    // Calculate daily returns for each stock
    const stocksWithReturns = holdingsData.map(stock => {
      const returns = [];
      for (let i = 1; i < stock.prices.length; i++) {
        const dailyReturn = (stock.prices[i] - stock.prices[i - 1]) / stock.prices[i - 1];
        returns.push(dailyReturn);
      }
      return {
        ...stock,
        returns: returns,
        mean: returns.reduce((sum, r) => sum + r, 0) / returns.length
      };
    });
    
    // Build covariance matrix
    const n = stocksWithReturns.length;
    const covarianceMatrix = Array(n).fill(0).map(() => Array(n).fill(0));
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) {
          // Variance
          const squaredDiffs = stocksWithReturns[i].returns.map(r => 
            Math.pow(r - stocksWithReturns[i].mean, 2)
          );
          const variance = squaredDiffs.reduce((sum, sd) => sum + sd, 0) / (stocksWithReturns[i].returns.length - 1);
          covarianceMatrix[i][j] = variance * 252; // Annualize
        } else if (j > i) {
          // Covariance
          const stock1 = stocksWithReturns[i];
          const stock2 = stocksWithReturns[j];
          const minLength = Math.min(stock1.returns.length, stock2.returns.length);
          
          let covariance = 0;
          for (let k = 0; k < minLength; k++) {
            covariance += (stock1.returns[k] - stock1.mean) * (stock2.returns[k] - stock2.mean);
          }
          covariance = (covariance / (minLength - 1)) * 252; // Annualize
          
          covarianceMatrix[i][j] = covariance;
          covarianceMatrix[j][i] = covariance;
        }
      }
    }
    
    // Calculate portfolio variance
    const weights = stocksWithReturns.map(s => s.weight);
    let portfolioVariance = 0;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        portfolioVariance += weights[i] * covarianceMatrix[i][j] * weights[j];
      }
    }
    
    const portfolioStdDev = Math.sqrt(portfolioVariance);
    console.log(`  ✓ Portfolio Standard Deviation: ${(portfolioStdDev * 100).toFixed(2)}%`);

    // STEP 6: Calculate Sharpe Ratio
    console.log('\n📊 STEP 6: Calculating Sharpe Ratio...');
    const sharpeRatio = (portfolioReturn - riskFreeRate) / portfolioStdDev;
    console.log(`  ✓ Sharpe Ratio: ${sharpeRatio.toFixed(3)}`);

    // STEP 7: Calculate Treynor Ratio
    console.log('\n📊 STEP 7: Calculating Treynor Ratio...');
    const treynorRatio = (portfolioReturn - riskFreeRate) / portfolioBeta;
    console.log(`  ✓ Treynor Ratio: ${treynorRatio.toFixed(3)}`);

    // STEP 8: Calculate Jensen's Alpha
    console.log('\n📊 STEP 8: Calculating Jensen\'s Alpha...');
    const expectedReturn = riskFreeRate + (marketReturn - riskFreeRate) * portfolioBeta;
    const jensensAlpha = portfolioReturn - expectedReturn;
    console.log(`  ✓ Jensen's Alpha: ${(jensensAlpha * 100).toFixed(3)}%`);

    console.log('\n✅ All metrics calculated successfully!\n');

    res.json({
      success: true,
      data: {
        // Core metrics
        portfolioReturn: portfolioReturn,
        portfolioReturnPercent: portfolioReturn * 100,
        portfolioBeta: portfolioBeta,
        portfolioStdDev: portfolioStdDev,
        portfolioStdDevPercent: portfolioStdDev * 100,
        
        // Performance metrics
        sharpeRatio: sharpeRatio,
        treynorRatio: treynorRatio,
        jensensAlpha: jensensAlpha,
        jensensAlphaPercent: jensensAlpha * 100,
        
        // Market data
        marketReturn: marketReturn,
        marketReturnPercent: marketReturn * 100,
        riskFreeRate: riskFreeRate,
        riskFreeRatePercent: riskFreeRate * 100,
        
        // Holdings details
        holdings: holdingsData.map(h => ({
          symbol: h.symbol,
          weight: h.weight,
          weightPercent: h.weight * 100,
          totalValue: h.totalValue,
          stockReturn: h.stockReturn,
          stockReturnPercent: h.stockReturn * 100,
          beta: h.beta
        })),
        
        // Additional info
        totalValue: portfolioTotalValue,
        totalCostBasis: totalCostBasis,
        calculationDate: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error calculating portfolio metrics:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    geminiConfigured: genAI !== null
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Yahoo Finance API Server running on http://localhost:${PORT}`);
  console.log(`📊 Available endpoints:`);
  console.log(`   - GET  /api/quote/:symbol`);
  console.log(`   - GET  /api/historical/:symbol`);
  console.log(`   - GET  /api/market-data`);
  console.log(`   - GET  /api/benchmark-funds`);
  console.log(`   - GET  /api/stock-info/:symbol`);
  console.log(`   - POST /api/portfolio-beta`);
  console.log(`   - POST /api/parse-statement (with file upload)`);
  console.log(`   - POST /api/calculate-portfolio-metrics`);
  console.log(`   - GET  /health`);
  console.log(`\n💡 Test with: http://localhost:${PORT}/api/quote/AAPL`);
  console.log(`🤖 Gemini AI: ${genAI ? '✅ Configured' : '❌ Not configured (set GEMINI_API_KEY)'}`);
});

