import React, { useState } from 'react';
import { X, Save, Loader } from 'lucide-react';
import { savePortfolio } from '../services/portfolioService';

const SavePortfolioModal = ({ isOpen, onClose, portfolioData, onSaved }) => {
  const [portfolioName, setPortfolioName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!portfolioName.trim()) {
      setError('Please enter a portfolio name');
      return;
    }

    setSaving(true);
    setError(null);

    const result = await savePortfolio(portfolioName.trim(), portfolioData);

    if (result.success) {
      console.log('Portfolio saved successfully:', result.data);
      if (onSaved) onSaved(result.data);
      setPortfolioName('');
      onClose();
    } else {
      setError(result.error || 'Failed to save portfolio');
    }

    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Save Portfolio</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div>
            <label htmlFor="portfolio-name" className="block text-sm font-medium text-gray-700 mb-2">
              Portfolio Name
            </label>
            <input
              id="portfolio-name"
              type="text"
              value={portfolioName}
              onChange={(e) => setPortfolioName(e.target.value)}
              placeholder="e.g., My Retirement Portfolio"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              disabled={saving}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="text-sm text-gray-600">
            This will save your portfolio with all holdings and calculated metrics to your account.
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavePortfolioModal;

