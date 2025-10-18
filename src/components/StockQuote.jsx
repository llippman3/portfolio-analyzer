import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, DollarSign, BarChart2 } from 'lucide-react';
import { getQuote, getStockInfo } from '../services/api';

const StockQuote = () => {
  const [symbol, setSymbol] = useState('');
  const [quote, setQuote] = useState(null);
  const [stockInfo, setStockInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!symbol.trim()) {
      setError('Please enter a stock symbol');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const [quoteData, infoData] = await Promise.all([
        getQuote(symbol.toUpperCase()),
        getStockInfo(symbol.toUpperCase()).catch(() => null)
      ]);
      
      setQuote(quoteData);
      setStockInfo(infoData);
    } catch (err) {
      setError(err.message || 'Failed to fetch stock data');
      setQuote(null);
      setStockInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const quickSymbols = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN', 'SPY', 'QQQ'];

  return (
    <div className="card">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Stock Quote Lookup</h3>
      
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="Enter symbol (e.g., AAPL)"
              className="input-field pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all disabled:opacity-50 font-semibold"
          >
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Quick Access Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-sm text-gray-600 self-center mr-2">Quick:</span>
        {quickSymbols.map(sym => (
          <button
            key={sym}
            onClick={() => {
              setSymbol(sym);
              setTimeout(() => {
                const form = document.querySelector('form');
                form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
              }, 0);
            }}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-semibold text-gray-700 transition-all"
          >
            {sym}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {quote && (
        <div className="space-y-4">
          {/* Main Quote Card */}
          <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-2xl font-bold text-gray-900">{quote.symbol}</h4>
                <p className="text-sm text-gray-600">{quote.shortName || quote.longName}</p>
              </div>
              {quote.change >= 0 ? (
                <TrendingUp className="w-8 h-8 text-green-600" />
              ) : (
                <TrendingDown className="w-8 h-8 text-red-600" />
              )}
            </div>

            <div className="mb-4">
              <div className="text-4xl font-bold text-gray-900 mb-1">
                ${quote.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="text-sm text-gray-500 ml-2">{quote.currency}</span>
              </div>
              <div className={`text-lg font-semibold ${
                quote.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {quote.change >= 0 ? '+' : ''}{quote.change.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
                ({quote.changePercent >= 0 ? '+' : ''}{quote.changePercent.toFixed(2)}%)
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Day High:</span>
                <span className="ml-2 font-semibold text-gray-900">${quote.dayHigh?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-600">Day Low:</span>
                <span className="ml-2 font-semibold text-gray-900">${quote.dayLow?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-600">52W High:</span>
                <span className="ml-2 font-semibold text-gray-900">${quote.fiftyTwoWeekHigh?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-600">52W Low:</span>
                <span className="ml-2 font-semibold text-gray-900">${quote.fiftyTwoWeekLow?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 'N/A'}</span>
              </div>
              {quote.marketCap && (
                <div className="col-span-2">
                  <span className="text-gray-600">Market Cap:</span>
                  <span className="ml-2 font-semibold text-gray-900">
                    ${(quote.marketCap / 1e9).toFixed(2)}B
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Beta Information */}
          {stockInfo?.beta && (
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <BarChart2 className="w-5 h-5 text-purple-600" />
                <h5 className="font-semibold text-gray-800">Portfolio Metrics</h5>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Beta:</span>
                  <span className="ml-2 font-bold text-purple-900">{stockInfo.beta.toFixed(3)}</span>
                </div>
                <div>
                  <span className="text-gray-600">vs Market:</span>
                  <span className={`ml-2 font-semibold ${
                    stockInfo.beta > 1 ? 'text-red-600' : stockInfo.beta < 1 ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {stockInfo.beta > 1 ? 'More Volatile' : stockInfo.beta < 1 ? 'Less Volatile' : 'Market Level'}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Beta measures volatility relative to the market. 1.0 = market volatility, &gt;1.0 = more volatile, &lt;1.0 = less volatile
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StockQuote;

