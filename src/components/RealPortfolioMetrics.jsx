import React, { useState } from 'react';
import { TrendingUp, Target, Activity, PieChart, BarChart3, DollarSign, ChevronUp, ChevronDown } from 'lucide-react';

const RealPortfolioMetrics = ({ metricsData }) => {
  const [showVolatilities, setShowVolatilities] = useState(false);
  const [showCorrelations, setShowCorrelations] = useState(false);

  if (!metricsData) return null;

  const formatPercent = (value) => {
    if (value === null || value === undefined || isNaN(value)) return 'N/A';
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const formatDecimal = (value, decimals = 3) => {
    if (value === null || value === undefined || isNaN(value)) return 'N/A';
    return value.toFixed(decimals);
  };

  // Determine colors based on metric values
  const getSharpeColor = (sharpe) => {
    if (sharpe < 0) return 'text-red-600 bg-red-50 border-red-300';
    if (sharpe < 1) return 'text-orange-600 bg-orange-50 border-orange-300';
    if (sharpe < 2) return 'text-yellow-600 bg-yellow-50 border-yellow-300';
    return 'text-green-600 bg-green-50 border-green-300';
  };

  const getAlphaColor = (alpha) => {
    if (alpha < -2) return 'text-red-600 bg-red-50 border-red-300';
    if (alpha < 0) return 'text-orange-600 bg-orange-50 border-orange-300';
    if (alpha < 1) return 'text-yellow-600 bg-yellow-50 border-yellow-300';
    return 'text-green-600 bg-green-50 border-green-300';
  };

  const getSharpeRating = (sharpe) => {
    if (sharpe < 0) return 'Poor';
    if (sharpe < 1) return 'Below Average';
    if (sharpe < 2) return 'Good';
    if (sharpe < 3) return 'Very Good';
    return 'Exceptional';
  };

  const getAlphaRating = (alpha) => {
    if (alpha < -2) return 'Underperforming';
    if (alpha < 0) return 'Below Market';
    if (alpha < 1) return 'Market Performance';
    if (alpha < 3) return 'Outperforming';
    return 'Exceptional';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-8 h-8" />
          <h2 className="text-3xl font-bold">Your Portfolio Performance Analysis</h2>
        </div>
        <p className="text-blue-100">
          Real calculations based on your actual holdings and 1-year historical data
        </p>
        <p className="text-xs text-blue-200 mt-2">
          Calculated on: {new Date(metricsData.calculationDate).toLocaleString()}
        </p>
      </div>

      {/* Key Performance Metrics Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Sharpe Ratio */}
        <div className={`p-6 rounded-xl border-2 shadow-lg ${getSharpeColor(metricsData.sharpeRatio)}`}>
          <div className="flex items-center gap-3 mb-3">
            <Target className="w-7 h-7" />
            <div>
              <h3 className="text-lg font-bold">Sharpe Ratio</h3>
              <p className="text-xs opacity-80">Risk-Adjusted Return</p>
            </div>
          </div>
          <div className="text-4xl font-bold mb-2">
            {formatDecimal(metricsData.sharpeRatio)}
          </div>
          <div className="text-sm font-semibold mb-2">
            Rating: {getSharpeRating(metricsData.sharpeRatio)}
          </div>
          <p className="text-xs opacity-90">
            {metricsData.sharpeRatio < 1 
              ? "Your risk-adjusted returns could be improved. Consider rebalancing or benchmark funds."
              : metricsData.sharpeRatio < 2
              ? "Good risk-adjusted performance. Continue monitoring."
              : "Excellent! Your portfolio has strong risk-adjusted returns."}
          </p>
        </div>

        {/* Jensen's Alpha */}
        <div className={`p-6 rounded-xl border-2 shadow-lg ${getAlphaColor(metricsData.jensensAlphaPercent)}`}>
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-7 h-7" />
            <div>
              <h3 className="text-lg font-bold">Jensen's Alpha</h3>
              <p className="text-xs opacity-80">Value Added vs Market</p>
            </div>
          </div>
          <div className="text-4xl font-bold mb-2">
            {formatPercent(metricsData.jensensAlphaPercent)}
          </div>
          <div className="text-sm font-semibold mb-2">
            Rating: {getAlphaRating(metricsData.jensensAlphaPercent)}
          </div>
          <p className="text-xs opacity-90">
            {metricsData.jensensAlphaPercent < 0 
              ? "Underperforming the market. Index funds might serve you better."
              : metricsData.jensensAlphaPercent < 1
              ? "Matching market returns. Consider low-cost index alternatives."
              : "Great! You're outperforming the market."}
          </p>
        </div>

        {/* Treynor Ratio */}
        <div className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border-2 border-indigo-300 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <Activity className="w-7 h-7 text-indigo-600" />
            <div>
              <h3 className="text-lg font-bold text-indigo-900">Treynor Ratio</h3>
              <p className="text-xs text-indigo-700">Return per Unit of Risk</p>
            </div>
          </div>
          <div className="text-4xl font-bold text-indigo-900 mb-2">
            {formatDecimal(metricsData.treynorRatio)}
          </div>
          <p className="text-xs text-indigo-800">
            Measures excess return per unit of systematic risk (beta). Higher is better for diversified portfolios.
          </p>
        </div>
      </div>

      {/* Portfolio Characteristics */}
      <div className="card">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <PieChart className="w-6 h-6 text-primary-600" />
          Portfolio Characteristics
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Return */}
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
            <p className="text-sm font-semibold text-green-800 mb-1">Annual Return (1Y)</p>
            <p className="text-3xl font-bold text-green-900">
              {formatPercent(metricsData.portfolioReturnPercent)}
            </p>
            <p className="text-xs text-green-700 mt-1">Weighted average of holdings</p>
          </div>

          {/* Standard Deviation */}
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <p className="text-sm font-semibold text-purple-800 mb-1">Standard Deviation</p>
            <p className="text-3xl font-bold text-purple-900">
              {formatPercent(metricsData.portfolioStdDevPercent)}
            </p>
            <p className="text-xs text-purple-700 mt-1">Portfolio volatility (risk)</p>
          </div>

          {/* Beta */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <p className="text-sm font-semibold text-blue-800 mb-1">Portfolio Beta</p>
            <p className="text-3xl font-bold text-blue-900">
              {formatDecimal(metricsData.portfolioBeta)}
            </p>
            <p className="text-xs text-blue-700 mt-1">
              {metricsData.portfolioBeta > 1 
                ? 'More volatile than market' 
                : metricsData.portfolioBeta < 1 
                ? 'Less volatile than market' 
                : 'Moves with market'}
            </p>
          </div>

          {/* Market Comparison */}
          <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
            <p className="text-sm font-semibold text-gray-800 mb-1">vs S&P 500</p>
            <p className="text-3xl font-bold text-gray-900">
              {formatPercent(metricsData.marketReturnPercent)}
            </p>
            <p className="text-xs text-gray-700 mt-1">Market return (1-year)</p>
          </div>
        </div>
      </div>

      {/* Holdings Breakdown */}
      {metricsData.holdings && metricsData.holdings.length > 0 && (
        <div className="card">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-primary-600" />
            Holdings Performance
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Symbol</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-700">Weight</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-700">1Y Return</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-700">Beta</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-700">Total Value</th>
                </tr>
              </thead>
              <tbody>
                {metricsData.holdings.map((holding, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-primary-700">{holding.symbol}</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {formatPercent(holding.weightPercent)}
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${
                      holding.stockReturnPercent >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatPercent(holding.stockReturnPercent)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatDecimal(holding.beta, 2)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      ${holding.totalValue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Market Context */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-5">
        <h4 className="font-bold text-blue-900 mb-3 text-lg">📊 Market Context</h4>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-blue-700">Risk-Free Rate (T-Bills):</span>
            <span className="ml-2 font-bold text-blue-900">
              {formatPercent(metricsData.riskFreeRatePercent)}
            </span>
          </div>
          <div>
            <span className="text-blue-700">S&P 500 Return (1Y):</span>
            <span className="ml-2 font-bold text-blue-900">
              {formatPercent(metricsData.marketReturnPercent)}
            </span>
          </div>
          <div>
            <span className="text-blue-700">Your Portfolio Return:</span>
            <span className={`ml-2 font-bold ${
              metricsData.portfolioReturnPercent > metricsData.marketReturnPercent 
                ? 'text-green-600' 
                : 'text-orange-600'
            }`}>
              {formatPercent(metricsData.portfolioReturnPercent)}
            </span>
          </div>
        </div>
      </div>

      {/* Interpretation Guide */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-6">
        <h4 className="font-bold text-purple-900 mb-3 text-xl">💡 What Do These Numbers Mean?</h4>
        
        <div className="space-y-3 text-sm">
          <div>
            <strong className="text-purple-900">Sharpe Ratio:</strong>
            <span className="text-purple-800 ml-2">
              Measures how much return you're getting for each unit of risk. A ratio above 1.0 is good, above 2.0 is very good.
            </span>
          </div>
          
          <div>
            <strong className="text-purple-900">Jensen's Alpha:</strong>
            <span className="text-purple-800 ml-2">
              Shows if you're beating the market after adjusting for risk. Positive = outperforming, negative = underperforming.
            </span>
          </div>
          
          <div>
            <strong className="text-purple-900">Treynor Ratio:</strong>
            <span className="text-purple-800 ml-2">
              Similar to Sharpe but uses beta instead of total volatility. Best for comparing well-diversified portfolios.
            </span>
          </div>
          
          <div>
            <strong className="text-purple-900">Beta:</strong>
            <span className="text-purple-800 ml-2">
              Measures how much your portfolio moves with the market. Beta of 1.0 = moves with market, &gt;1.0 = more volatile, &lt;1.0 = less volatile.
            </span>
          </div>
        </div>
      </div>

      {/* Individual Stock Volatilities - Collapsible */}
      {metricsData.holdings && metricsData.holdings.length > 0 && (
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <button
            onClick={() => setShowVolatilities(!showVolatilities)}
            className="w-full flex items-center justify-between hover:bg-gray-50 p-2 rounded transition-colors"
          >
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gray-600" />
              Individual Stock Volatilities
            </h4>
            {showVolatilities ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>
          
          {showVolatilities && (
            <div className="space-y-2 mt-3">
              {metricsData.holdings.map((holding, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <span className="font-semibold text-gray-900">{holding.symbol}</span>
                    <span className="text-sm text-gray-600 ml-2">
                      ({holding.weightPercent?.toFixed(1)}% of portfolio)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-purple-700">
                      {holding.stdDevPercent ? holding.stdDevPercent.toFixed(2) : 'N/A'}%
                    </span>
                    {holding.stdDevPercent && (
                      <span className="text-xs text-gray-500 ml-1">
                        (5Y)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Correlation Info - Collapsible */}
      {metricsData.correlationMatrix && metricsData.holdings && metricsData.holdings.length > 1 && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <button
            onClick={() => setShowCorrelations(!showCorrelations)}
            className="w-full flex items-center justify-between hover:bg-blue-100 p-2 rounded transition-colors"
          >
            <div>
              <h4 className="font-semibold text-blue-900">📊 Stock Correlations</h4>
              <p className="text-xs text-blue-800 text-left">
                How your stocks move together (1.0 = perfectly correlated, 0 = independent, -1.0 = inverse)
              </p>
            </div>
            {showCorrelations ? (
              <ChevronUp className="w-5 h-5 text-blue-700 flex-shrink-0 ml-2" />
            ) : (
              <ChevronDown className="w-5 h-5 text-blue-700 flex-shrink-0 ml-2" />
            )}
          </button>
          
          {showCorrelations && (
            <div className="grid grid-cols-2 gap-2 text-xs mt-3">
              {metricsData.holdings.map((holding1, i) => 
                metricsData.holdings.slice(i + 1).map((holding2, j) => {
                  const actualJ = i + j + 1;
                  const corr = metricsData.correlationMatrix[i][actualJ];
                  if (!corr && corr !== 0) return null;
                  return (
                    <div key={`${i}-${actualJ}`} className="bg-white p-2 rounded">
                      <span className="font-semibold">{holding1.symbol} ↔ {holding2.symbol}:</span>
                      <span className={`ml-2 font-bold ${
                        corr > 0.7 ? 'text-green-600' : 
                        corr > 0.3 ? 'text-yellow-600' : 
                        'text-red-600'
                      }`}>
                        {corr.toFixed(3)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RealPortfolioMetrics;



