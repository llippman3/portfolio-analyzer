import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell } from 'recharts';
import { BarChart3 } from 'lucide-react';

const PerformanceCharts = ({ portfolioMetrics, benchmarkReturn = 10 }) => {
  // Metrics comparison data
  const metricsData = [
    {
      name: 'Sharpe Ratio',
      value: portfolioMetrics.sharpeRatio,
      benchmark: 1.0,
      fill: portfolioMetrics.sharpeRatio >= 1 ? '#10b981' : '#ef4444'
    },
    {
      name: 'Treynor Ratio',
      value: portfolioMetrics.treynorRatio,
      benchmark: 0.05,
      fill: portfolioMetrics.treynorRatio >= 0.05 ? '#10b981' : '#ef4444'
    },
    {
      name: 'Alpha (%)',
      value: portfolioMetrics.jensensAlpha * 100,
      benchmark: 0,
      fill: portfolioMetrics.jensensAlpha >= 0 ? '#10b981' : '#ef4444'
    }
  ];

  // Future Value projection data
  const futureValueData = portfolioMetrics.futureValue ? (() => {
    const data = [];
    const pv = portfolioMetrics.presentValue || 10000;
    const rate = portfolioMetrics.portfolioReturn;
    const years = portfolioMetrics.years;

    for (let year = 0; year <= years; year++) {
      data.push({
        year,
        'Your Portfolio': pv * Math.pow(1 + rate, year),
        'Market Benchmark': pv * Math.pow(1 + benchmarkReturn / 100, year)
      });
    }
    return data;
  })() : null;

  // Risk-Return comparison
  const riskReturnData = [
    {
      subject: 'Return',
      portfolio: (portfolioMetrics.portfolioReturn * 100).toFixed(1),
      market: benchmarkReturn,
      fullMark: 20
    },
    {
      subject: 'Risk-Adj. Return',
      portfolio: (portfolioMetrics.sharpeRatio * 5).toFixed(1),
      market: 5,
      fullMark: 15
    },
    {
      subject: 'Alpha',
      portfolio: ((portfolioMetrics.jensensAlpha + 0.05) * 100).toFixed(1),
      market: 5,
      fullMark: 10
    },
    {
      subject: 'Volatility',
      portfolio: (portfolioMetrics.standardDeviation ? (20 - portfolioMetrics.standardDeviation * 100) : 10).toFixed(1),
      market: 10,
      fullMark: 20
    }
  ];

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-8 h-8 text-primary-600" />
        <h2 className="text-2xl font-bold text-gray-800">Performance Visualizations</h2>
      </div>

      <div className="space-y-8">
        {/* Metrics Comparison Bar Chart */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Metrics vs. Benchmarks</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metricsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
                formatter={(value) => value.toFixed(3)}
              />
              <Legend />
              <Bar dataKey="value" name="Your Portfolio" radius={[8, 8, 0, 0]}>
                {metricsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
              <Bar dataKey="benchmark" name="Good Benchmark" fill="#94a3b8" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-sm text-gray-600 mt-2 text-center">
            Green bars indicate strong performance, red bars suggest room for improvement
          </p>
        </div>

        {/* Future Value Growth Chart */}
        {futureValueData && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Growth Projection Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={futureValueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="year" 
                  label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  label={{ value: 'Value ($)', angle: -90, position: 'insideLeft' }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
                  formatter={(value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="Your Portfolio" 
                  stroke="#0ea5e9" 
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Market Benchmark" 
                  stroke="#64748b" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 mt-2 text-center">
              Assuming {(portfolioMetrics.portfolioReturn * 100).toFixed(1)}% annual return vs. {benchmarkReturn}% market benchmark
            </p>
          </div>
        )}

        {/* Risk-Return Radar Chart */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk-Return Profile</h3>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={riskReturnData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={90} domain={[0, 'dataMax']} />
              <Radar 
                name="Your Portfolio" 
                dataKey="portfolio" 
                stroke="#0ea5e9" 
                fill="#0ea5e9" 
                fillOpacity={0.6}
              />
              <Radar 
                name="Market Average" 
                dataKey="market" 
                stroke="#64748b" 
                fill="#64748b" 
                fillOpacity={0.3}
              />
              <Legend />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
              />
            </RadarChart>
          </ResponsiveContainer>
          <p className="text-sm text-gray-600 mt-2 text-center">
            Larger area indicates stronger overall performance across multiple dimensions
          </p>
        </div>

        {/* Performance Summary Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div className="text-sm font-semibold text-blue-800 mb-1">Return Difference</div>
            <div className="text-2xl font-bold text-blue-900">
              {((portfolioMetrics.portfolioReturn * 100) - benchmarkReturn).toFixed(2)}%
            </div>
            <div className="text-xs text-blue-700 mt-1">vs. Market Benchmark</div>
          </div>

          <div className={`p-4 rounded-lg border ${
            portfolioMetrics.sharpeRatio >= 1 
              ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200' 
              : 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200'
          }`}>
            <div className={`text-sm font-semibold mb-1 ${
              portfolioMetrics.sharpeRatio >= 1 ? 'text-green-800' : 'text-orange-800'
            }`}>
              Risk Efficiency
            </div>
            <div className={`text-2xl font-bold ${
              portfolioMetrics.sharpeRatio >= 1 ? 'text-green-900' : 'text-orange-900'
            }`}>
              {portfolioMetrics.sharpeRatio >= 1 ? 'Strong' : 'Needs Work'}
            </div>
            <div className={`text-xs mt-1 ${
              portfolioMetrics.sharpeRatio >= 1 ? 'text-green-700' : 'text-orange-700'
            }`}>
              Sharpe: {portfolioMetrics.sharpeRatio.toFixed(2)}
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${
            portfolioMetrics.jensensAlpha >= 0 
              ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200' 
              : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
          }`}>
            <div className={`text-sm font-semibold mb-1 ${
              portfolioMetrics.jensensAlpha >= 0 ? 'text-green-800' : 'text-red-800'
            }`}>
              Management Value
            </div>
            <div className={`text-2xl font-bold ${
              portfolioMetrics.jensensAlpha >= 0 ? 'text-green-900' : 'text-red-900'
            }`}>
              {portfolioMetrics.jensensAlpha >= 0 ? 'Adding' : 'Subtracting'}
            </div>
            <div className={`text-xs mt-1 ${
              portfolioMetrics.jensensAlpha >= 0 ? 'text-green-700' : 'text-red-700'
            }`}>
              Alpha: {(portfolioMetrics.jensensAlpha * 100).toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceCharts;




