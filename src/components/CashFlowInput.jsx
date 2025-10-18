import React, { useState } from 'react';
import { PlusCircle, MinusCircle, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

const CashFlowInput = ({ onCalculateReturns }) => {
  const [cashFlows, setCashFlows] = useState([
    { id: 1, date: '', amount: '', type: 'deposit' }
  ]);

  const addCashFlow = () => {
    setCashFlows([...cashFlows, { 
      id: Date.now(), 
      date: '', 
      amount: '', 
      type: 'deposit' 
    }]);
  };

  const removeCashFlow = (id) => {
    if (cashFlows.length > 1) {
      setCashFlows(cashFlows.filter(cf => cf.id !== id));
    }
  };

  const updateCashFlow = (id, field, value) => {
    setCashFlows(cashFlows.map(cf => 
      cf.id === id ? { ...cf, [field]: value } : cf
    ));
  };

  const handleCalculate = () => {
    // Validate and prepare cash flows
    const validFlows = cashFlows
      .filter(cf => cf.date && cf.amount)
      .map(cf => ({
        date: new Date(cf.date),
        amount: cf.type === 'deposit' ? parseFloat(cf.amount) : -parseFloat(cf.amount)
      }));

    if (validFlows.length < 2) {
      alert('Please enter at least 2 cash flows with dates and amounts.');
      return;
    }

    // Sort by date
    validFlows.sort((a, b) => a.date - b.date);

    // Calculate period returns for TWR
    const periodReturns = [];
    for (let i = 0; i < validFlows.length - 1; i++) {
      // Simplified: assume equal returns between cash flows
      // In real scenario, you'd need portfolio values at each date
      const timeDiff = (validFlows[i + 1].date - validFlows[i].date) / (365.25 * 24 * 60 * 60 * 1000);
      periodReturns.push(0.08 * timeDiff); // Placeholder: 8% annualized
    }

    onCalculateReturns({
      cashFlows: validFlows,
      periodReturns
    });
  };

  const totalDeposits = cashFlows
    .filter(cf => cf.type === 'deposit' && cf.amount)
    .reduce((sum, cf) => sum + parseFloat(cf.amount || 0), 0);

  const totalWithdrawals = cashFlows
    .filter(cf => cf.type === 'withdrawal' && cf.amount)
    .reduce((sum, cf) => sum + parseFloat(cf.amount || 0), 0);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Cash Flow Tracker</h2>
          <p className="text-sm text-gray-600 mt-1">Track deposits and withdrawals for accurate return calculations</p>
        </div>
        <button
          onClick={addCashFlow}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all"
        >
          <PlusCircle className="w-5 h-5" />
          Add Cash Flow
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm font-semibold text-green-800">Total Deposits</span>
          </div>
          <div className="text-2xl font-bold text-green-900">
            ${totalDeposits.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-red-600" />
            <span className="text-sm font-semibold text-red-800">Total Withdrawals</span>
          </div>
          <div className="text-2xl font-bold text-red-900">
            ${totalWithdrawals.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Cash Flow Entries */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {cashFlows.map((cf, index) => (
          <div key={cf.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold text-sm">
              {index + 1}
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={cf.date}
                  onChange={(e) => updateCashFlow(cf.id, 'date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Amount ($)</label>
                <input
                  type="number"
                  value={cf.amount}
                  onChange={(e) => updateCashFlow(cf.id, 'amount', e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Type</label>
                <select
                  value={cf.type}
                  onChange={(e) => updateCashFlow(cf.id, 'type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="deposit">Deposit</option>
                  <option value="withdrawal">Withdrawal</option>
                </select>
              </div>
            </div>

            {cashFlows.length > 1 && (
              <button
                onClick={() => removeCashFlow(cf.id)}
                className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleCalculate}
        className="btn-primary w-full mt-6"
      >
        Calculate Dollar & Time-Weighted Returns
      </button>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Dollar-Weighted Return accounts for when you added/removed money. 
          Time-Weighted Return shows the pure investment performance without cash flow effects.
        </p>
      </div>
    </div>
  );
};

export default CashFlowInput;




