import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

const ExpandableSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-neutral-200 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 bg-white hover:bg-neutral-50 flex items-center justify-between transition-all border-b border-neutral-200"
      >
        <h3 className="text-lg font-light tracking-tight text-black">{title}</h3>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-black" strokeWidth={1.5} />
        ) : (
          <ChevronDown className="w-5 h-5 text-neutral-400" strokeWidth={1.5} />
        )}
      </button>
      {isOpen && (
        <div className="px-6 py-6 bg-white">
          {children}
        </div>
      )}
    </div>
  );
};

const EducationalContent = () => {
  return (
    <div className="card">
      <div className="mb-12">
        <h2 className="text-4xl font-light mb-4 tracking-tight">Understanding Your Metrics</h2>
        <p className="text-sm uppercase tracking-widest text-neutral-400">Educational Resources</p>
      </div>

      <div className="space-y-4">
        {/* Sharpe Ratio */}
        <ExpandableSection title="Sharpe Ratio: Risk-Adjusted Returns" defaultOpen={true}>
          <div className="space-y-4 text-neutral-600">
            <p className="text-xs uppercase tracking-widest text-neutral-400">Formula</p>
            <p className="font-mono text-sm text-black">(Portfolio Return - Risk-Free Rate) / Standard Deviation</p>
            
            <div className="bg-neutral-50 p-5 border-l-2 border-black mt-6">
              <p className="text-xs uppercase tracking-widest text-neutral-400 mb-2">What It Measures</p>
              <p className="leading-relaxed text-sm">The Sharpe Ratio tells you how much excess return you're receiving for the extra volatility you endure by holding a risky asset instead of a risk-free asset.</p>
            </div>

            <div className="bg-neutral-50 p-5 border-l-2 border-black">
              <p className="text-xs uppercase tracking-widest text-neutral-400 mb-3">Interpretation</p>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-3"><strong className="text-black min-w-[60px]">&lt; 0:</strong> <span>Portfolio returns less than risk-free rate (poor)</span></li>
                <li className="flex gap-3"><strong className="text-black min-w-[60px]">0 to 1:</strong> <span>Suboptimal risk-adjusted returns</span></li>
                <li className="flex gap-3"><strong className="text-black min-w-[60px]">1 to 2:</strong> <span>Good risk-adjusted returns</span></li>
                <li className="flex gap-3"><strong className="text-black min-w-[60px]">2 to 3:</strong> <span>Very good performance</span></li>
                <li className="flex gap-3"><strong className="text-black min-w-[60px]">&gt; 3:</strong> <span>Exceptional performance (rare)</span></li>
              </ul>
            </div>

            <p className="leading-relaxed text-sm pt-4"><strong className="text-black">Why It Matters:</strong> A higher Sharpe Ratio means you're getting more return for each unit of risk. This is crucial for comparing investments with different risk levels.</p>
          </div>
        </ExpandableSection>

        {/* Treynor Ratio */}
        <ExpandableSection title="Treynor Ratio: Systematic Risk Performance">
          <div className="space-y-3 text-gray-700">
            <p className="font-semibold text-primary-700">Formula: (Portfolio Return - Risk-Free Rate) / Beta</p>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-semibold mb-2">What It Measures:</p>
              <p>The Treynor Ratio measures returns earned in excess of what could have been earned on a risk-free investment per unit of market risk (beta).</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <p className="font-semibold mb-2">Key Difference from Sharpe:</p>
              <p>While Sharpe uses total risk (standard deviation), Treynor uses only systematic risk (beta). This makes it better for comparing well-diversified portfolios.</p>
            </div>

            <p><strong>Best Used When:</strong> You have a diversified portfolio and want to measure how well you're being compensated for taking on market risk specifically.</p>
          </div>
        </ExpandableSection>

        {/* Jensen's Alpha */}
        <ExpandableSection title="Jensen's Alpha: Value Added by Management">
          <div className="space-y-3 text-gray-700">
            <p className="font-semibold text-primary-700">Formula: Portfolio Return - [Risk-Free Rate + (Market Return - Risk-Free Rate) × Beta]</p>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-semibold mb-2">What It Measures:</p>
              <p>Alpha represents the value added (or subtracted) by portfolio management. It's the difference between your actual return and the expected return based on your portfolio's risk level.</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <p className="font-semibold mb-2">Interpretation:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Positive Alpha:</strong> Outperforming expectations (good management/stock picking)</li>
                <li><strong>Zero Alpha:</strong> Performing exactly as expected given the risk</li>
                <li><strong>Negative Alpha:</strong> Underperforming expectations (consider passive funds)</li>
              </ul>
            </div>

            <p><strong>Critical Insight:</strong> Most actively managed funds have negative alpha after fees. If yours is negative, you're paying for underperformance and should consider low-cost index funds.</p>
          </div>
        </ExpandableSection>

        {/* Future Value */}
        <ExpandableSection title="Future Value: Long-Term Growth Projection">
          <div className="space-y-3 text-gray-700">
            <p className="font-semibold text-primary-700">Formula: Present Value × (1 + Return Rate)^Years</p>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-semibold mb-2">What It Measures:</p>
              <p>Future Value shows what your current investment will grow to over time, assuming a constant annual return rate.</p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="font-semibold mb-2">Important Caveat:</p>
              <p>This assumes consistent returns, which never happens in real markets. Use it as a planning tool, not a guarantee. Consider running scenarios with different return rates.</p>
            </div>

            <p><strong>Planning Tool:</strong> Useful for retirement planning and goal setting. Remember that even small differences in return rates compound dramatically over long periods.</p>
          </div>
        </ExpandableSection>

        {/* Dollar vs Time Weighted Returns */}
        <ExpandableSection title="Dollar-Weighted vs Time-Weighted Returns">
          <div className="space-y-3 text-gray-700">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="font-semibold mb-2">Dollar-Weighted Return (DWR):</p>
              <p>Accounts for the timing and size of your cash flows (deposits and withdrawals). This is YOUR actual return as an investor.</p>
              <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                <li>Includes the impact of when you add or remove money</li>
                <li>Can be lower if you bought high and sold low</li>
                <li>Reflects your behavioral impact on returns</li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <p className="font-semibold mb-2">Time-Weighted Return (TWR):</p>
              <p>Removes the effect of cash flows to measure pure investment performance. This measures your MANAGER'S performance.</p>
              <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                <li>Ignores timing and size of contributions/withdrawals</li>
                <li>Shows how the investments themselves performed</li>
                <li>Better for comparing to benchmarks</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="font-semibold mb-2">Key Insight:</p>
              <p>If your DWR is significantly lower than TWR, it means your timing of deposits/withdrawals hurt performance. This is common and suggests you might benefit from dollar-cost averaging or a more systematic investment approach.</p>
            </div>
          </div>
        </ExpandableSection>

        {/* General Investment Wisdom */}
        <ExpandableSection title="General Investment Guidelines">
          <div className="space-y-3 text-gray-700">
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-4 rounded-lg border border-primary-200">
              <p className="font-semibold mb-3 text-primary-900">Key Principles for Retail Investors:</p>
              
              <ol className="list-decimal list-inside space-y-3 ml-2">
                <li>
                  <strong>Fees Matter:</strong> A 1% annual fee can cost you hundreds of thousands over a lifetime. Most actively managed funds don't beat their benchmarks after fees.
                </li>
                <li>
                  <strong>Diversification is Key:</strong> Don't put all eggs in one basket. The benchmark funds shown provide instant diversification.
                </li>
                <li>
                  <strong>Time in Market &gt; Timing the Market:</strong> Consistent, long-term investing typically beats trying to time market highs and lows.
                </li>
                <li>
                  <strong>Rebalance Regularly:</strong> Maintain your target asset allocation by rebalancing at least annually.
                </li>
                <li>
                  <strong>Know Your Risk Tolerance:</strong> Choose investments that let you sleep at night. The best plan is one you'll stick with.
                </li>
                <li>
                  <strong>Consider Tax Efficiency:</strong> In taxable accounts, low-turnover index funds and ETFs are typically more tax-efficient.
                </li>
                <li>
                  <strong>Automate When Possible:</strong> Set up automatic contributions to take emotion out of investing decisions.
                </li>
              </ol>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border border-red-200 mt-4">
              <p className="font-semibold mb-2 text-red-900">When to Consider Switching to Benchmark Funds:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Negative or near-zero alpha consistently</li>
                <li>Sharpe Ratio below 1.0</li>
                <li>High expense ratios (&gt;0.5% for stock funds, &gt;0.3% for bond funds)</li>
                <li>You don't have time to actively manage your portfolio</li>
                <li>Your portfolio lacks proper diversification</li>
              </ul>
            </div>
          </div>
        </ExpandableSection>
      </div>
    </div>
  );
};

export default EducationalContent;

