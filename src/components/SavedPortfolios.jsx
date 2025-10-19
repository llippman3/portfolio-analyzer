import React, { useState, useEffect } from 'react';
import { Folder, Trash2, Calendar, Loader, AlertCircle } from 'lucide-react';
import { getUserPortfolios, deletePortfolio } from '../services/portfolioService';
import { useAuth } from '../contexts/AuthContext';

const SavedPortfolios = ({ onLoadPortfolio }) => {
  const { user } = useAuth();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (user) {
      loadPortfolios();
    }
  }, [user]);

  const loadPortfolios = async () => {
    setLoading(true);
    setError(null);

    const result = await getUserPortfolios();

    if (result.success) {
      setPortfolios(result.data || []);
    } else {
      setError(result.error || 'Failed to load portfolios');
    }

    setLoading(false);
  };

  const handleDelete = async (portfolioId, portfolioName) => {
    if (!confirm(`Are you sure you want to delete "${portfolioName}"?`)) {
      return;
    }

    setDeleting(portfolioId);

    const result = await deletePortfolio(portfolioId);

    if (result.success) {
      setPortfolios(portfolios.filter(p => p.id !== portfolioId));
    } else {
      alert(`Failed to delete portfolio: ${result.error}`);
    }

    setDeleting(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="card">
        <div className="flex items-center gap-3 text-gray-600">
          <AlertCircle className="w-5 h-5" />
          <p>Sign in to view your saved portfolios</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card flex items-center justify-center py-10">
        <Loader className="w-8 h-8 animate-spin text-primary-600 mr-3" />
        <p className="text-gray-700">Loading portfolios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="flex items-center gap-3 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (portfolios.length === 0) {
    return (
      <div className="card text-center py-10">
        <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">No saved portfolios yet</p>
        <p className="text-sm text-gray-500">Upload a brokerage statement to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Saved Portfolios ({portfolios.length})</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.map((portfolio) => (
          <div
            key={portfolio.id}
            className="card hover:border-primary-500 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Folder className="w-6 h-6 text-primary-600 flex-shrink-0" />
                <h3 className="font-semibold text-lg text-gray-900 truncate">
                  {portfolio.portfolio_name}
                </h3>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(portfolio.id, portfolio.portfolio_name);
                }}
                className="text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
                disabled={deleting === portfolio.id}
              >
                {deleting === portfolio.id ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(portfolio.created_at)}</span>
              </div>
              <div className="text-xs text-gray-500">
                {portfolio.portfolio_data?.extractedData?.holdings?.length || 0} holdings
              </div>
              {portfolio.portfolio_data?.extractedData?.totalValue && (
                <div className="text-sm font-semibold text-primary-600">
                  ${portfolio.portfolio_data.extractedData.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              )}
            </div>

            <button
              onClick={() => onLoadPortfolio && onLoadPortfolio(portfolio)}
              className="w-full py-2 bg-gray-100 hover:bg-primary-600 hover:text-white text-gray-700 rounded-lg transition-colors text-sm font-medium"
            >
              Load Portfolio
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedPortfolios;

