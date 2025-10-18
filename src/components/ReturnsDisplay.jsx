import React from 'react';
import { Calendar, DollarSign, Clock, Info } from 'lucide-react';

const ReturnsDisplay = ({ dollarWeightedReturn, timeWeightedReturn, cashFlows }) => {
  const getDifferenceInsight = () => {
    const diff = Math.abs(dollarWeightedReturn - timeWeightedReturn) * 100;
    
    if (diff < 1) {
      return {
        message: "Your investment timing had minimal impact on returns. Good job maintaining discipline!",
        color: "green"
      };
    } else if (diff < 3) {
      return {
        message: "Your investment timing had a modest impact. Consider dollar-cost averaging for more consistent results.",
        color: "yellow"
      };
    } else {
      if (dollarWeightedReturn < timeWeightedReturn) {
        return {
          message: "Your timing hurt returns. You may have bought high or sold low. Consider automatic investing to avoid emotional decisions.",
          color: "red"
        };
      } else {
        return {
          message: "Excellent timing! You added money at opportune moments. This is difficult to sustain long-term.",
          color: "green"
        };
      }
    }
  };

  const insight = getDifferenceInsight();

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dollar vs. Time-Weighted Returns</h2>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Dollar-Weighted Return */}
        <div className="metric-card border-2 border-blue-300 bg-blue-50">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Dollar-Weighted Return</h3>
              <p className="text-xs text-gray-600">Your Actual Return</p>
            </div>
          </div>
          
          <div className="text-4xl font-bold text-blue-900 mb-4">
            {(dollarWeightedReturn * 100).toFixed(2)}%
          </div>

          <div className="bg-white bg-opacity-70 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                Accounts for when and how much you invested. This is the return YOU actually experienced as an investor.
              </p>
            </div>
          </div>
        </div>

        {/* Time-Weighted Return */}
        <div className="metric-card border-2 border-purple-300 bg-purple-50">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-8 h-8 text-purple-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Time-Weighted Return</h3>
              <p className="text-xs text-gray-600">Investment Performance</p>
            </div>
          </div>
          
          <div className="text-4xl font-bold text-purple-900 mb-4">
            {(timeWeightedReturn * 100).toFixed(2)}%
          </div>

          <div className="bg-white bg-opacity-70 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                Removes cash flow effects. This shows how well your investments performed, independent of your timing decisions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Insight */}
      <div className={`p-5 rounded-lg border-2 ${
        insight.color === 'green' ? 'bg-green-50 border-green-400' :
        insight.color === 'yellow' ? 'bg-yellow-50 border-yellow-400' :
        'bg-red-50 border-red-400'
      }`}>
        <div className="flex items-start gap-3">
          <Calendar className={`w-6 h-6 flex-shrink-0 mt-0.5 ${
            insight.color === 'green' ? 'text-green-600' :
            insight.color === 'yellow' ? 'text-yellow-600' :
            'text-red-600'
          }`} />
          <div>
            <h4 className={`font-semibold mb-2 ${
              insight.color === 'green' ? 'text-green-900' :
              insight.color === 'yellow' ? 'text-yellow-900' :
              'text-red-900'
            }`}>
              Timing Impact: {Math.abs((dollarWeightedReturn - timeWeightedReturn) * 100).toFixed(2)}% Difference
            </h4>
            <p className={`text-sm ${
              insight.color === 'green' ? 'text-green-800' :
              insight.color === 'yellow' ? 'text-yellow-800' :
              'text-red-800'
            }`}>
              {insight.message}
            </p>
          </div>
        </div>
      </div>

      {/* Cash Flow Summary */}
      {cashFlows && cashFlows.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3">Cash Flow Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total Contributions:</span>
              <span className="ml-2 font-semibold text-green-700">
                ${cashFlows.filter(cf => cf.amount > 0).reduce((sum, cf) => sum + cf.amount, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Total Withdrawals:</span>
              <span className="ml-2 font-semibold text-red-700">
                ${Math.abs(cashFlows.filter(cf => cf.amount < 0).reduce((sum, cf) => sum + cf.amount, 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Number of Transactions:</span>
              <span className="ml-2 font-semibold text-gray-800">{cashFlows.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Time Period:</span>
              <span className="ml-2 font-semibold text-gray-800">
                {cashFlows.length >= 2 ? 
                  `${((cashFlows[cashFlows.length - 1].date - cashFlows[0].date) / (365.25 * 24 * 60 * 60 * 1000)).toFixed(1)} years` 
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Educational Note */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">Understanding the Difference:</h4>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>If DWR &lt; TWR: You bought when prices were higher or sold when they were lower (poor timing)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>If DWR = TWR: Your timing didn't significantly impact returns (neutral timing)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>If DWR &gt; TWR: You bought when prices were lower (good timing - but hard to replicate!)</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ReturnsDisplay;




