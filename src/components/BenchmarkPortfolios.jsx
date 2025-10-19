import React, { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, Activity, Loader, AlertCircle } from 'lucide-react';

const BenchmarkPortfolios = ({ userPortfolioMetrics }) => {
  const [benchmarkData, setBenchmarkData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const benchmarks = [
    {
      category: 'Ultra Conservative',
      portfolios: [
        { symbol: 'VASIX', name: 'Vanguard LifeStrategy Income', equity: 20, bonds: 80 },
        { symbol: 'AOK', name: 'iShares Core Conservative', equity: 30, bonds: 70 }
      ]
    },
    {
      category: 'Conservative',
      portfolios: [
        { symbol: 'VSCGX', name: 'Vanguard LifeStrategy Conservative', equity: 40, bonds: 60 },
        { symbol: 'AOM', name: 'iShares Core Moderate', equity: 40, bonds: 60 }
      ]
    },
    {
      category: 'Moderate',
      portfolios: [
        { symbol: 'VSMGX', name: 'Vanguard LifeStrategy Moderate', equity: 60, bonds: 40 },
        { symbol: 'AOR', name: 'iShares Core Growth', equity: 60, bonds: 40 }
      ]
    },
    {
      category: 'Aggressive',
      portfolios: [
        { symbol: 'VASGX', name: 'Vanguard LifeStrategy Growth', equity: 80, bonds: 20 },
        { symbol: 'AOA', name: 'iShares Core Aggressive', equity: 80, bonds: 20 }
      ]
    }
  ];

  useEffect(() => {
    fetchBenchmarkData();
  }, []);

  const fetchBenchmarkData = async () => {
    setLoading(true);
    setError(null);

    try {
      const allBenchmarks = benchmarks.flatMap(cat => cat.portfolios);
      const results = [];

      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

      for (const benchmark of allBenchmarks) {
        try {
          console.log(`Fetching real data for ${benchmark.symbol}...`);
          
          // Use the new benchmark endpoint to get real Yahoo Finance data
          const response = await fetch(`${API_BASE_URL}/benchmark/${benchmark.symbol}`);
          const result = await response.json();
          
          if (result.success) {
            results.push({
              ...benchmark,
              metrics: result.data
            });
            console.log(`✅ Got data for ${benchmark.symbol}`);
          } else {
            console.error(`Failed to fetch ${benchmark.symbol}:`, result.error);
          }
        } catch (err) {
          console.error(`Error fetching ${benchmark.symbol}:`, err);
        }
      }

      setBenchmarkData(results);
      console.log(`📊 Loaded ${results.length} benchmark funds`);
    } catch (err) {
      setError('Failed to fetch benchmark data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatPercent = (value) => {
    if (value === null || value === undefined || isNaN(value)) return 'N/A';
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getComparisonColor = (userValue, benchmarkValue, higherIsBetter = true) => {
    if (!userValue || !benchmarkValue) return 'text-gray-700';
    const better = higherIsBetter 
      ? userValue > benchmarkValue 
      : userValue < benchmarkValue;
    return better ? 'text-green-600' : 'text-red-600';
  };

  if (!userPortfolioMetrics) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-yellow-900 mb-2">No Portfolio Data</h3>
          <p className="text-yellow-800">
            Please upload your brokerage statement first to compare against benchmarks.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center gap-3 p-8">
          <Loader className="w-8 h-8 text-primary-600 animate-spin" />
          <p className="text-lg text-gray-700">Loading benchmark data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-red-900 mb-2">Error</h3>
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio Benchmarks</h1>
        <p className="text-gray-600">
          Compare your portfolio's performance against standard allocation benchmarks
        </p>
      </div>

      {/* Your Portfolio Summary */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 border-2 border-primary-300 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-primary-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          Your Portfolio
        </h2>
        <div className="grid md:grid-cols-5 gap-4">
          <div>
            <p className="text-sm text-primary-700 mb-1">Return (5Y)</p>
            <p className="text-2xl font-bold text-primary-900">
              {formatPercent(userPortfolioMetrics.portfolioReturnPercent)}
            </p>
          </div>
          <div>
            <p className="text-sm text-primary-700 mb-1">Std Dev</p>
            <p className="text-2xl font-bold text-primary-900">
              {formatPercent(userPortfolioMetrics.portfolioStdDevPercent)}
            </p>
          </div>
          <div>
            <p className="text-sm text-primary-700 mb-1">Sharpe Ratio</p>
            <p className="text-2xl font-bold text-primary-900">
              {userPortfolioMetrics.sharpeRatio?.toFixed(3) || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-primary-700 mb-1">Beta</p>
            <p className="text-2xl font-bold text-primary-900">
              {userPortfolioMetrics.portfolioBeta?.toFixed(3) || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-primary-700 mb-1">Alpha</p>
            <p className="text-2xl font-bold text-primary-900">
              {formatPercent(userPortfolioMetrics.jensensAlphaPercent)}
            </p>
          </div>
        </div>
      </div>

      {/* Benchmark Categories */}
      {benchmarks.map((category, idx) => (
        <div key={idx} className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary-600" />
            {category.category}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {category.portfolios.map((portfolio) => {
              const data = benchmarkData?.find(b => b.symbol === portfolio.symbol);
              
              return (
                <div key={portfolio.symbol} className="bg-white rounded-lg border-2 border-gray-200 p-6 hover:border-primary-300 transition-colors">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{portfolio.symbol}</h3>
                    <p className="text-sm text-gray-600">{portfolio.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {portfolio.equity}% Equities, {portfolio.bonds}% Bonds
                    </p>
                  </div>

                  {data?.metrics ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Return (5Y):</span>
                        <div className="text-right">
                          <span className="font-semibold text-gray-900">
                            {formatPercent(data.metrics.portfolioReturnPercent)}
                          </span>
                          <span className={`ml-2 text-xs font-semibold ${
                            getComparisonColor(
                              userPortfolioMetrics.portfolioReturnPercent,
                              data.metrics.portfolioReturnPercent,
                              true
                            )
                          }`}>
                            {userPortfolioMetrics.portfolioReturnPercent > data.metrics.portfolioReturnPercent ? '↑' : '↓'}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Std Dev:</span>
                        <div className="text-right">
                          <span className="font-semibold text-gray-900">
                            {formatPercent(data.metrics.portfolioStdDevPercent)}
                          </span>
                          <span className={`ml-2 text-xs font-semibold ${
                            getComparisonColor(
                              userPortfolioMetrics.portfolioStdDevPercent,
                              data.metrics.portfolioStdDevPercent,
                              false
                            )
                          }`}>
                            {userPortfolioMetrics.portfolioStdDevPercent < data.metrics.portfolioStdDevPercent ? '↑' : '↓'}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Sharpe Ratio:</span>
                        <div className="text-right">
                          <span className="font-semibold text-gray-900">
                            {data.metrics.sharpeRatio?.toFixed(3) || 'N/A'}
                          </span>
                          <span className={`ml-2 text-xs font-semibold ${
                            getComparisonColor(
                              userPortfolioMetrics.sharpeRatio,
                              data.metrics.sharpeRatio,
                              true
                            )
                          }`}>
                            {userPortfolioMetrics.sharpeRatio > data.metrics.sharpeRatio ? '↑' : '↓'}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Beta:</span>
                        <span className="font-semibold text-gray-900">
                          {data.metrics.portfolioBeta?.toFixed(3) || 'N/A'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Alpha:</span>
                        <div className="text-right">
                          <span className="font-semibold text-gray-900">
                            {formatPercent(data.metrics.jensensAlphaPercent)}
                          </span>
                          <span className={`ml-2 text-xs font-semibold ${
                            getComparisonColor(
                              userPortfolioMetrics.jensensAlphaPercent,
                              data.metrics.jensensAlphaPercent,
                              true
                            )
                          }`}>
                            {userPortfolioMetrics.jensensAlphaPercent > data.metrics.jensensAlphaPercent ? '↑' : '↓'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Data unavailable</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Performance Comparison Chart */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-6 mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Activity className="w-6 h-6 text-primary-600" />
          Risk vs Return Comparison
        </h2>
        
        <div className="relative" style={{ height: '400px' }}>
          <svg width="100%" height="100%" viewBox="0 0 800 400" className="border border-gray-200 rounded">
            {/* Axes */}
            <line x1="80" y1="350" x2="750" y2="350" stroke="#999" strokeWidth="2" />
            <line x1="80" y1="50" x2="80" y2="350" stroke="#999" strokeWidth="2" />
            
            {/* Axis labels */}
            <text x="400" y="390" textAnchor="middle" className="text-sm fill-gray-600">
              Standard Deviation (Risk) %
            </text>
            <text x="20" y="200" textAnchor="middle" transform="rotate(-90, 20, 200)" className="text-sm fill-gray-600">
              Annual Return %
            </text>

            {/* Plot points */}
            {benchmarkData && benchmarkData.map((benchmark, idx) => {
              const x = 80 + (benchmark.metrics.portfolioStdDevPercent / 30) * 670;
              const y = 350 - (benchmark.metrics.portfolioReturnPercent / 20) * 300;
              
              return (
                <g key={idx}>
                  <circle cx={x} cy={y} r="6" fill="#3B82F6" opacity="0.7" />
                  <text x={x} y={y - 10} textAnchor="middle" className="text-xs fill-gray-700">
                    {benchmark.symbol}
                  </text>
                </g>
              );
            })}

            {/* User portfolio point */}
            {userPortfolioMetrics && (
              <g>
                <circle 
                  cx={80 + (userPortfolioMetrics.portfolioStdDevPercent / 30) * 670} 
                  cy={350 - (userPortfolioMetrics.portfolioReturnPercent / 20) * 300}
                  r="10" 
                  fill="#10B981" 
                  stroke="#065F46"
                  strokeWidth="2"
                />
                <text 
                  x={80 + (userPortfolioMetrics.portfolioStdDevPercent / 30) * 670} 
                  y={350 - (userPortfolioMetrics.portfolioReturnPercent / 20) * 300 - 15}
                  textAnchor="middle" 
                  className="text-sm font-bold fill-green-700"
                >
                  Your Portfolio
                </text>
              </g>
            )}
          </svg>
        </div>

        <div className="mt-4 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-green-700"></div>
            <span className="text-gray-700">Your Portfolio</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500 opacity-70"></div>
            <span className="text-gray-700">Benchmark Funds</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenchmarkPortfolios;

