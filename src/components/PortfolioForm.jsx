import React, { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';

const PortfolioForm = ({ onCalculate, autoFillData }) => {
  const [formData, setFormData] = useState({
    portfolioReturn: '',
    riskFreeRate: '4.5',
    standardDeviation: '',
    beta: '',
    marketReturn: '10',
    presentValue: '',
    years: '',
    riskTolerance: 'Moderate'
  });

  // Auto-fill when data is provided
  useEffect(() => {
    if (autoFillData) {
      setFormData(prev => ({
        ...prev,
        ...autoFillData
      }));
    }
  }, [autoFillData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert percentages to decimals
    const data = {
      portfolioReturn: parseFloat(formData.portfolioReturn) / 100,
      riskFreeRate: parseFloat(formData.riskFreeRate) / 100,
      standardDeviation: parseFloat(formData.standardDeviation) / 100,
      beta: parseFloat(formData.beta),
      marketReturn: parseFloat(formData.marketReturn) / 100,
      presentValue: parseFloat(formData.presentValue),
      years: parseInt(formData.years),
      riskTolerance: formData.riskTolerance
    };
    
    onCalculate(data);
  };

  return (
    <div className="card">
      <div className="mb-8">
        <h2 className="text-4xl font-light mb-4 tracking-tight">Portfolio Information</h2>
        <p className="text-sm uppercase tracking-widest text-neutral-400">Enter Your Investment Details</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Portfolio Return */}
          <div>
            <label className="block text-xs font-medium text-black mb-3 uppercase tracking-widest">
              Portfolio Return (%)
              <span className="text-black ml-1">*</span>
            </label>
            <input
              type="number"
              name="portfolioReturn"
              value={formData.portfolioReturn}
              onChange={handleChange}
              step="0.01"
              required
              className="input-field"
              placeholder="e.g., 12.5"
            />
            <p className="text-xs text-neutral-400 mt-2">Your portfolio's annual return</p>
          </div>

          {/* Risk-Free Rate */}
          <div>
            <label className="block text-xs font-medium text-black mb-3 uppercase tracking-widest">
              Risk-Free Rate (%)
              <span className="text-black ml-1">*</span>
            </label>
            <input
              type="number"
              name="riskFreeRate"
              value={formData.riskFreeRate}
              onChange={handleChange}
              step="0.01"
              required
              className="input-field"
              placeholder="e.g., 4.5"
            />
            <p className="text-xs text-neutral-400 mt-2">Current T-Bill rate (default: 4.5%)</p>
          </div>

          {/* Standard Deviation */}
          <div>
            <label className="block text-xs font-medium text-black mb-3 uppercase tracking-widest">
              Portfolio Standard Deviation (%)
              <span className="text-black ml-1">*</span>
            </label>
            <input
              type="number"
              name="standardDeviation"
              value={formData.standardDeviation}
              onChange={handleChange}
              step="0.01"
              required
              className="input-field"
              placeholder="e.g., 15"
            />
            <p className="text-xs text-neutral-400 mt-2">Portfolio volatility measure</p>
          </div>

          {/* Beta */}
          <div>
            <label className="block text-xs font-medium text-black mb-3 uppercase tracking-widest">
              Portfolio Beta
              <span className="text-black ml-1">*</span>
            </label>
            <input
              type="number"
              name="beta"
              value={formData.beta}
              onChange={handleChange}
              step="0.01"
              required
              className="input-field"
              placeholder="e.g., 1.2"
            />
            <p className="text-xs text-neutral-400 mt-2">Systematic risk measure (market = 1.0)</p>
          </div>

          {/* Market Return */}
          <div>
            <label className="block text-xs font-medium text-black mb-3 uppercase tracking-widest">
              Market Return (%)
              <span className="text-black ml-1">*</span>
            </label>
            <input
              type="number"
              name="marketReturn"
              value={formData.marketReturn}
              onChange={handleChange}
              step="0.01"
              required
              className="input-field"
              placeholder="e.g., 10"
            />
            <p className="text-xs text-neutral-400 mt-2">S&P 500 or market benchmark return</p>
          </div>

          {/* Risk Tolerance */}
          <div>
            <label className="block text-xs font-medium text-black mb-3 uppercase tracking-widest">
              Risk Tolerance
              <span className="text-black ml-1">*</span>
            </label>
            <select
              name="riskTolerance"
              value={formData.riskTolerance}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value="Ultra Conservative">Ultra Conservative</option>
              <option value="Conservative">Conservative</option>
              <option value="Moderate">Moderate</option>
              <option value="Aggressive">Aggressive</option>
            </select>
            <p className="text-xs text-neutral-400 mt-2">For benchmark comparison</p>
          </div>
        </div>

        {/* Future Value Calculation Section */}
        <div className="border-t border-neutral-200 pt-8 mt-8">
          <h3 className="text-2xl font-light mb-6 tracking-tight">Future Value Projection (Optional)</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-black mb-3 uppercase tracking-widest">
                Initial Investment ($)
              </label>
              <input
                type="number"
                name="presentValue"
                value={formData.presentValue}
                onChange={handleChange}
                step="0.01"
                className="input-field"
                placeholder="e.g., 10000"
              />
              <p className="text-xs text-neutral-400 mt-2">Current portfolio value</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-black mb-3 uppercase tracking-widest">
                Investment Horizon (Years)
              </label>
              <input
                type="number"
                name="years"
                value={formData.years}
                onChange={handleChange}
                step="1"
                min="1"
                className="input-field"
                placeholder="e.g., 10"
              />
              <p className="text-xs text-neutral-400 mt-2">Years until retirement/goal</p>
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary w-full mt-8">
          Calculate Portfolio Metrics
        </button>
      </form>
    </div>
  );
};

export default PortfolioForm;

