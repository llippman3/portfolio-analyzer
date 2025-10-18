import React, { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';
import { getMarketData, checkServerHealth } from '../services/api';

const LiveMarketData = ({ onAutoFill }) => {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serverOnline, setServerOnline] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkHealth();
    fetchMarketData();
  }, []);

  const checkHealth = async () => {
    const isOnline = await checkServerHealth();
    setServerOnline(isOnline);
  };

  const fetchMarketData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getMarketData();
      setMarketData(data);
      setServerOnline(true);
    } catch (err) {
      setError(err.message);
      setServerOnline(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFill = () => {
    if (marketData && onAutoFill) {
      onAutoFill({
        marketReturn: marketData.sp500.yearReturn.toFixed(2),
        riskFreeRate: marketData.riskFreeRate.toFixed(2)
      });
    }
  };

  if (!serverOnline && !loading) {
    return (
      <div className="card bg-yellow-50 border border-yellow-300">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
          <h3 className="text-lg font-semibold text-yellow-900">Live Market Data Offline</h3>
        </div>
        <p className="text-sm text-yellow-800 mb-3">
          The Yahoo Finance server is not running. Start it to enable live market data.
        </p>
        <code className="text-xs bg-yellow-100 p-2 rounded block text-yellow-900">
          cd server && npm install && npm start
        </code>
      </div>
    );
  }

  return (
    <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${serverOnline ? 'bg-green-500' : 'bg-red-500'} ${serverOnline ? 'animate-pulse' : ''}`}></div>
          <h3 className="text-lg font-semibold text-gray-800">Live Market Data</h3>
        </div>
        <button
          onClick={fetchMarketData}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="text-sm font-semibold">Refresh</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {loading && !marketData && (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      )}

      {marketData && (
        <>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {/* S&P 500 (SPY) */}
            <div className="p-4 bg-white rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-600">S&P 500 (SPY)</span>
                {marketData.sp500.change >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                ${marketData.sp500.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className={`text-sm font-semibold ${
                marketData.sp500.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {marketData.sp500.change >= 0 ? '+' : ''}{marketData.sp500.change.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
                ({marketData.sp500.changePercent >= 0 ? '+' : ''}{marketData.sp500.changePercent.toFixed(2)}%)
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200">
                <span className="text-xs text-gray-600">1-Year Return: </span>
                <span className="text-xs font-bold text-blue-700">
                  {marketData.sp500.yearReturn.toFixed(2)}%
                </span>
              </div>
            </div>

            {/* Risk-Free Rate */}
            <div className="p-4 bg-white rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-600">13-Week T-Bill</span>
                <Percent className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {marketData.riskFreeRate.toFixed(2)}%
              </div>
              <div className="text-sm text-gray-600">
                Risk-Free Rate
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  Updated: {new Date(marketData.lastUpdated).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>

          {/* Auto-Fill Button */}
          <button
            onClick={handleAutoFill}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg"
          >
            <DollarSign className="w-5 h-5" />
            <span className="font-semibold">Auto-Fill Form with Live Data</span>
          </button>
        </>
      )}
    </div>
  );
};

export default LiveMarketData;

