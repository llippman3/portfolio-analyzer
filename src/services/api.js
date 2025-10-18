/**
 * API Service for communicating with backend Yahoo Finance server
 */

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Get quote for a stock symbol
 * @param {string} symbol - Stock symbol (e.g., 'AAPL', 'MSFT')
 * @returns {Promise<Object>} Quote data
 */
export const getQuote = async (symbol) => {
  try {
    const response = await fetch(`${API_BASE_URL}/quote/${symbol}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch quote');
    }
    
    return data.data;
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Get historical data and returns
 * @param {string} symbol - Stock symbol
 * @param {string} period - Time period ('1y', '3y', '5y')
 * @returns {Promise<Object>} Historical data with return calculation
 */
export const getHistoricalData = async (symbol, period = '1y') => {
  try {
    const response = await fetch(`${API_BASE_URL}/historical/${symbol}?period=${period}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch historical data');
    }
    
    return data.data;
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Get comprehensive market data (S&P 500, T-Bill rate)
 * @returns {Promise<Object>} Market data
 */
export const getMarketData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/market-data`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch market data');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
};

/**
 * Get benchmark fund data
 * @returns {Promise<Array>} Array of benchmark fund data
 */
export const getBenchmarkFunds = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/benchmark-funds`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch benchmark funds');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetching benchmark funds:', error);
    throw error;
  }
};

/**
 * Get detailed stock information including beta
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Object>} Stock information
 */
export const getStockInfo = async (symbol) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stock-info/${symbol}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch stock info');
    }
    
    return data.data;
  } catch (error) {
    console.error(`Error fetching stock info for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Calculate portfolio beta from holdings
 * @param {Array} holdings - Array of {symbol, weight} objects
 * @returns {Promise<Object>} Portfolio beta calculation
 */
export const calculatePortfolioBeta = async (holdings) => {
  try {
    const response = await fetch(`${API_BASE_URL}/portfolio-beta`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ holdings })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to calculate portfolio beta');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error calculating portfolio beta:', error);
    throw error;
  }
};

/**
 * Calculate portfolio standard deviation from holdings
 * @param {Array} holdings - Array of {symbol, weight} objects
 * @returns {Promise<Object>} Portfolio standard deviation calculation
 */
export const calculatePortfolioStdDev = async (holdings) => {
  try {
    const response = await fetch(`${API_BASE_URL}/calculate-portfolio-stddev`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ holdings })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to calculate portfolio standard deviation');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error calculating portfolio standard deviation:', error);
    throw error;
  }
};

/**
 * Calculate comprehensive portfolio metrics (Sharpe, Treynor, Jensen's Alpha, etc.)
 * @param {Array} holdings - Array of {symbol, totalValue} objects
 * @param {number} totalValue - Total portfolio value
 * @param {number} totalCostBasis - Total cost basis
 * @returns {Promise<Object>} Complete portfolio analysis
 */
export const calculateComprehensiveMetrics = async (holdings, totalValue, totalCostBasis) => {
  try {
    const response = await fetch(`${API_BASE_URL}/calculate-portfolio-metrics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ holdings, totalValue, totalCostBasis })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to calculate portfolio metrics');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error calculating comprehensive metrics:', error);
    throw error;
  }
};

/**
 * Check if API server is healthy
 * @returns {Promise<boolean>} Server health status
 */
export const checkServerHealth = async () => {
  try {
    const healthUrl = import.meta.env.VITE_API_URL 
      ? `${import.meta.env.VITE_API_URL.replace('/api', '')}/health`
      : 'http://localhost:3001/health';
    const response = await fetch(healthUrl);
    const data = await response.json();
    return data.status === 'ok';
  } catch (error) {
    return false;
  }
};

