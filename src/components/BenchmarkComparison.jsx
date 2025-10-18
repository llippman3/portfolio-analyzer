import React from 'react';
import { BarChart3, AlertCircle, CheckCircle } from 'lucide-react';
import { BENCHMARK_FUNDS } from '../utils/calculations';

const BenchmarkComparison = ({ riskTolerance, portfolioMetrics }) => {
  const benchmarks = BENCHMARK_FUNDS[riskTolerance] || [];
  
  const getRiskToleranceDescription = (level) => {
    const descriptions = {
      'Ultra Conservative': 'Low risk tolerance with capital preservation focus. Suitable for investors nearing retirement or those who cannot afford significant losses.',
      'Conservative': 'Below-average risk tolerance with income generation focus. Suitable for investors with shorter time horizons or limited risk capacity.',
      'Moderate': 'Balanced approach between growth and stability. Suitable for investors with medium-term goals and moderate risk capacity.',
      'Aggressive': 'Higher risk tolerance focused on growth. Suitable for younger investors with long time horizons and ability to withstand volatility.'
    };
    return descriptions[level] || '';
  };

  const shouldConsiderBenchmark = () => {
    if (!portfolioMetrics) return false;
    
    // Suggest benchmarks if Sharpe Ratio < 1 or Alpha < 0
    return portfolioMetrics.sharpeRatio < 1 || portfolioMetrics.jensensAlpha < 0;
  };

  return (
    <div className="card">
      <div className="mb-12">
        <h2 className="text-4xl font-light mb-4 tracking-tight">Benchmark Comparison</h2>
        <p className="text-sm uppercase tracking-widest text-neutral-400">Alternative Investment Options</p>
      </div>

      <div className="mb-8 p-6 bg-neutral-50 border border-neutral-200">
        <h3 className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-3">Your Risk Profile</h3>
        <h4 className="text-2xl font-light mb-3">{riskTolerance}</h4>
        <p className="text-sm text-neutral-600 leading-relaxed">{getRiskToleranceDescription(riskTolerance)}</p>
      </div>

      {portfolioMetrics && (
        <div className={`mb-8 p-6 border-2 ${
          shouldConsiderBenchmark() 
            ? 'bg-neutral-100 border-black' 
            : 'bg-black text-white border-black'
        }`}>
          <div className="flex items-start gap-4">
            {shouldConsiderBenchmark() ? (
              <AlertCircle className="w-6 h-6 text-black flex-shrink-0 mt-0.5" strokeWidth={1.5} />
            ) : (
              <CheckCircle className="w-6 h-6 text-white flex-shrink-0 mt-0.5" strokeWidth={1.5} />
            )}
            <div>
              <h4 className={`text-xl font-light mb-3 ${
                shouldConsiderBenchmark() ? 'text-black' : 'text-white'
              }`}>
                {shouldConsiderBenchmark() 
                  ? 'Consider Benchmark Alternatives' 
                  : 'Strong Performance!'}
              </h4>
              <p className={`text-sm leading-relaxed ${
                shouldConsiderBenchmark() ? 'text-neutral-600' : 'text-neutral-300'
              }`}>
                {shouldConsiderBenchmark()
                  ? 'Your risk-adjusted returns suggest you may benefit from switching to low-cost benchmark funds. These funds offer professional diversification, lower fees, and have historically delivered consistent returns.'
                  : 'Your portfolio is performing well on a risk-adjusted basis. Continue monitoring your performance and consider the benchmark funds below as alternatives for passive income streams or portfolio diversification.'}
              </p>
            </div>
          </div>
        </div>
      )}

      <h3 className="text-2xl font-light mb-8 tracking-tight">
        Recommended Funds for Your Risk Profile
      </h3>

      <div className="space-y-6">
        {benchmarks.map((fund, index) => (
          <div key={index} className="p-6 bg-white border border-neutral-200 hover:border-black transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-3xl font-light tracking-tight mb-2">{fund.symbol}</h4>
                <p className="text-sm text-neutral-600">{fund.name}</p>
              </div>
              <span className="px-4 py-2 bg-black text-white text-xs uppercase tracking-wider">
                {fund.allocation}
              </span>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-6 text-sm pb-6 border-b border-neutral-200">
              <div>
                <span className="text-xs uppercase tracking-widest text-neutral-400 block mb-1">Asset Mix</span>
                <span className="font-medium text-black">{fund.allocation}</span>
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-neutral-400 block mb-1">Type</span>
                <span className="font-medium text-black">
                  {fund.symbol.startsWith('V') ? 'Mutual Fund' : 'ETF'}
                </span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-neutral-50">
              <p className="text-xs text-neutral-600 leading-relaxed">
                <strong className="text-black">Why consider this fund:</strong> {
                  index === 0 
                    ? 'Vanguard offers extremely low expense ratios and has a strong track record of consistent performance.' 
                    : 'iShares provides excellent liquidity and diversification through a single ETF with low costs.'
                }
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-8 bg-neutral-50 border border-neutral-200">
        <h4 className="text-xl font-light mb-6 tracking-tight">Benefits of Benchmark Funds</h4>
        <ul className="space-y-4 text-sm text-neutral-600">
          <li className="flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-black flex-shrink-0 mt-0.5" strokeWidth={1.5} />
            <span><strong className="text-black">Lower Costs:</strong> Expense ratios typically under 0.20% vs 1%+ for actively managed funds</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-black flex-shrink-0 mt-0.5" strokeWidth={1.5} />
            <span><strong className="text-black">Instant Diversification:</strong> Single fund provides exposure to thousands of securities</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-black flex-shrink-0 mt-0.5" strokeWidth={1.5} />
            <span><strong className="text-black">Automatic Rebalancing:</strong> Maintains target allocation without manual intervention</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-black flex-shrink-0 mt-0.5" strokeWidth={1.5} />
            <span><strong className="text-black">Tax Efficiency:</strong> Lower turnover typically results in fewer taxable events</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-black flex-shrink-0 mt-0.5" strokeWidth={1.5} />
            <span><strong className="text-black">Simplicity:</strong> Easy to manage and monitor with minimal time commitment</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BenchmarkComparison;

