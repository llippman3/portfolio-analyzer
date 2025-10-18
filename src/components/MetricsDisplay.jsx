import React from 'react';
import { TrendingUp, Shield, Award, DollarSign, Info } from 'lucide-react';

const MetricCard = ({ title, value, purpose, icon: Icon, feedback }) => {
  const getColorClass = (rating) => {
    switch (rating) {
      case 'red': return 'border-black border-2';
      case 'orange': return 'border-black border-2';
      case 'yellow': return 'border-neutral-400';
      case 'green': return 'border-black border-2';
      default: return 'border-neutral-200';
    }
  };

  return (
    <div className={`metric-card ${feedback ? getColorClass(feedback.color) : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xs font-medium text-neutral-400 mb-2 uppercase tracking-widest">{title}</h3>
          <div className="text-4xl font-light text-black">{value}</div>
        </div>
        {feedback && (
          <span className="text-xs font-medium px-3 py-1 bg-black text-white uppercase tracking-wider">
            {feedback.rating}
          </span>
        )}
      </div>
      
      <div className="space-y-3 pt-4 border-t border-neutral-200">
        <p className="text-sm text-neutral-600 leading-relaxed">{purpose}</p>
        
        {feedback && (
          <div className="mt-4 p-4 bg-neutral-50">
            <p className="text-sm text-black">{feedback.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const MetricsDisplay = ({ results }) => {
  return (
    <div className="card">
      <div className="mb-12">
        <h2 className="text-4xl font-light mb-4 tracking-tight">Portfolio Performance Metrics</h2>
        <p className="text-sm uppercase tracking-widest text-neutral-400">Risk-Adjusted Analysis</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Sharpe Ratio */}
        <MetricCard
          title="Sharpe Ratio"
          value={results.sharpeRatio.toFixed(3)}
          purpose="Measures the return of the portfolio that is in excess of the risk-free rate. Higher values indicate better risk-adjusted returns."
          icon={TrendingUp}
          feedback={results.sharpeFeedback}
        />

        {/* Treynor Ratio */}
        <MetricCard
          title="Treynor Ratio"
          value={results.treynorRatio.toFixed(3)}
          purpose="Measures excess portfolio return per unit of systematic risk (beta). Useful for comparing diversified portfolios."
          icon={Shield}
        />

        {/* Jensen's Alpha */}
        <MetricCard
          title="Jensen's Alpha"
          value={`${(results.jensensAlpha * 100).toFixed(2)}%`}
          purpose="Indicates value added through portfolio management. Positive alpha means outperforming the market, negative means underperforming."
          icon={Award}
          feedback={results.alphaFeedback}
        />

        {/* Future Value */}
        {results.futureValue && (
          <MetricCard
            title="Future Value"
            value={`$${results.futureValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            purpose={`Projected value after ${results.years} years at ${(results.portfolioReturn * 100).toFixed(2)}% annual return.`}
            icon={DollarSign}
          />
        )}
      </div>

      {/* Key Insights */}
      <div className="mt-12 p-8 bg-black text-white">
        <h3 className="text-2xl font-light mb-6 tracking-tight">Key Insights</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-1 h-1 bg-white rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-neutral-200 leading-relaxed">
              <span className="font-medium text-white">Risk-Adjusted Performance:</span> Your Sharpe Ratio of {results.sharpeRatio.toFixed(3)} suggests {results.sharpeFeedback.rating.toLowerCase()} risk-adjusted returns.
            </p>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-1 h-1 bg-white rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-neutral-200 leading-relaxed">
              <span className="font-medium text-white">Value Added:</span> Your alpha of {(results.jensensAlpha * 100).toFixed(2)}% indicates you're {results.jensensAlpha >= 0 ? 'outperforming' : 'underperforming'} the market by this amount annually.
            </p>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-1 h-1 bg-white rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-neutral-200 leading-relaxed">
              <span className="font-medium text-white">Systematic Risk:</span> With a beta of {results.beta.toFixed(2)}, your portfolio is {results.beta > 1 ? 'more volatile than' : results.beta < 1 ? 'less volatile than' : 'as volatile as'} the market.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsDisplay;

