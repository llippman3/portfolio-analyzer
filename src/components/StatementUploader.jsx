import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader, TrendingUp, Activity, ChevronDown, ChevronUp, Save } from 'lucide-react';
import { calculatePortfolioStdDev, calculateComprehensiveMetrics } from '../services/api';
import RealPortfolioMetrics from './RealPortfolioMetrics';
import SavePortfolioModal from './SavePortfolioModal';
import { useAuth } from '../contexts/AuthContext';

const StatementUploader = ({ onDataExtracted, onMetricsCalculated, initialData }) => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const [stdDevData, setStdDevData] = useState(null);
  const [calculatingStdDev, setCalculatingStdDev] = useState(false);
  const [comprehensiveMetrics, setComprehensiveMetrics] = useState(null);
  const [calculatingMetrics, setCalculatingMetrics] = useState(false);
  const [showVolatilities, setShowVolatilities] = useState(false);
  const [showCorrelations, setShowCorrelations] = useState(false);
  const [showHoldings, setShowHoldings] = useState(true);
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Load initial data if provided (for saved portfolios)
  // DON'T auto-refresh prices - let user click "Refresh Prices" button
  useEffect(() => {
    if (initialData) {
      if (initialData.extractedData) {
        setExtractedData(initialData.extractedData);
      }
      if (initialData.comprehensiveMetrics) {
        setComprehensiveMetrics(initialData.comprehensiveMetrics);
        // Notify parent component so Benchmarks tab gets the data
        if (onMetricsCalculated) {
          onMetricsCalculated(initialData.comprehensiveMetrics);
        }
      }
      if (initialData.stdDevData) {
        setStdDevData(initialData.stdDevData);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]); // Only re-run when initialData changes, not when onMetricsCalculated changes

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      
      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(selectedFile);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('statement', file);

      // Use environment variable for API URL
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_BASE_URL}/parse-statement`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to parse statement');
      }

      setExtractedData(result.data);
      
      // Calculate portfolio return from the data
      if (result.data.totalValue && result.data.totalCostBasis) {
        const portfolioReturn = ((result.data.totalValue - result.data.totalCostBasis) / result.data.totalCostBasis) * 100;
        result.data.calculatedReturn = portfolioReturn;
      }

      // Auto-calculate standard deviation if we have holdings
      if (result.data.holdings && result.data.holdings.length > 0) {
        calculateStdDev(result.data);
        // Auto-calculate comprehensive metrics
        calculateAllMetrics(result.data);
      }

      if (onDataExtracted) {
        onDataExtracted(result.data);
      }

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatPercent = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const refreshPrices = async () => {
    if (!extractedData || !extractedData.holdings) {
      setError('No portfolio data to refresh');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      console.log('🔄 Manually refreshing prices...');
      
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_BASE_URL}/update-portfolio-prices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolioData: extractedData })
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Prices refreshed successfully!');
        
        // Set the updated data with current prices
        setExtractedData(result.data);
        
        // Wait for state to update before calculating metrics
        // Use setTimeout to ensure the state update has propagated
        setTimeout(async () => {
          try {
            if (result.data.holdings && result.data.holdings.length > 0) {
              await calculateStdDev(result.data);
              await calculateAllMetrics(result.data);
            }
          } finally {
            setUploading(false);
          }
        }, 100);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error refreshing prices:', error);
      setError(`Failed to refresh prices: ${error.message}`);
      setUploading(false);
    }
  };

  const calculateStdDev = async (data) => {
    setCalculatingStdDev(true);
    setError(null);

    try {
      // Prepare holdings with weights based on portfolio value
      const totalValue = data.totalValue || data.holdings.reduce((sum, h) => sum + (h.totalValue || 0), 0);
      
      const holdings = data.holdings.map(h => ({
        symbol: h.symbol,
        weight: (h.totalValue || 0) / totalValue
      }));

      // Filter out holdings with 0 weight
      const validHoldings = holdings.filter(h => h.weight > 0);

      if (validHoldings.length === 0) {
        throw new Error('No valid holdings with value found');
      }

      // Normalize weights to sum to 1.0
      const weightSum = validHoldings.reduce((sum, h) => sum + h.weight, 0);
      const normalizedHoldings = validHoldings.map(h => ({
        symbol: h.symbol,
        weight: h.weight / weightSum
      }));

      const stdDev = await calculatePortfolioStdDev(normalizedHoldings);
      setStdDevData(stdDev);

    } catch (err) {
      console.error('Error calculating std dev:', err);
      setError(`Standard deviation calculation: ${err.message}`);
    } finally {
      setCalculatingStdDev(false);
    }
  };

  const calculateAllMetrics = async (data) => {
    setCalculatingMetrics(true);
    setError(null);

    try {
      console.log('🎯 Calculating comprehensive portfolio metrics...');
      
      // Prepare holdings data
      const holdings = data.holdings.filter(h => h.totalValue > 0);
      
      if (holdings.length === 0) {
        throw new Error('No valid holdings with value found');
      }

      // Call comprehensive metrics API
      const metrics = await calculateComprehensiveMetrics(
        holdings,
        data.totalValue,
        data.totalCostBasis
      );
      
      setComprehensiveMetrics(metrics);
      console.log('✅ Comprehensive metrics calculated successfully!');
      
      // Pass metrics to parent component
      if (onMetricsCalculated && metrics) {
        onMetricsCalculated(metrics);
      }

    } catch (err) {
      console.error('Error calculating comprehensive metrics:', err);
      setError(`Metrics calculation: ${err.message}`);
    } finally {
      setCalculatingMetrics(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-8 h-8 text-primary-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Upload Brokerage Statement</h2>
          <p className="text-sm text-gray-600">Powered by Gemini AI</p>
        </div>
      </div>

      {/* Upload Area */}
      <div className="mb-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-all">
          <input
            type="file"
            id="statement-upload"
            accept="image/*,.pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
          <label
            htmlFor="statement-upload"
            className="cursor-pointer flex flex-col items-center gap-3"
          >
            <Upload className="w-12 h-12 text-gray-400" />
            <div>
              <p className="text-lg font-semibold text-gray-700">
                {file ? file.name : 'Click to upload or drag and drop'}
              </p>
              <p className="text-sm text-gray-500">
                PNG, JPG, or PDF (Max 10MB)
              </p>
            </div>
          </label>
        </div>

        {preview && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Preview:</p>
            <img 
              src={preview} 
              alt="Statement preview" 
              className="max-h-64 mx-auto rounded-lg border border-gray-200"
            />
          </div>
        )}

        {file && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="btn-primary w-full mt-4"
          >
            {uploading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Analyzing with Gemini AI...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>Parse Statement</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-900">Error</p>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Extracted Data Display */}
      {extractedData && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <p className="font-semibold text-green-900">Statement parsed successfully!</p>
          </div>

          {/* Portfolio Summary */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-semibold text-blue-800 mb-1">Total Value</p>
              <p className="text-2xl font-bold text-blue-900">
                {formatCurrency(extractedData.totalValue)}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-semibold text-gray-800 mb-1">Cost Basis</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(extractedData.totalCostBasis)}
              </p>
            </div>

            <div className={`p-4 rounded-lg border ${
              extractedData.unrealizedGainLoss >= 0 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <p className={`text-sm font-semibold mb-1 ${
                extractedData.unrealizedGainLoss >= 0 ? 'text-green-800' : 'text-red-800'
              }`}>
                Unrealized Gain/Loss
              </p>
              <p className={`text-2xl font-bold ${
                extractedData.unrealizedGainLoss >= 0 ? 'text-green-900' : 'text-red-900'
              }`}>
                {formatCurrency(extractedData.unrealizedGainLoss)}
              </p>
              <p className={`text-sm font-semibold ${
                extractedData.unrealizedGainLoss >= 0 ? 'text-green-700' : 'text-red-700'
              }`}>
                {formatPercent(extractedData.unrealizedGainLossPercent)}
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm font-semibold text-purple-800 mb-1">Income Earned</p>
              <p className="text-2xl font-bold text-purple-900">
                {formatCurrency(extractedData.incomeEarned)}
              </p>
            </div>
          </div>

          {/* Refresh Prices Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={refreshPrices}
              disabled={uploading || calculatingMetrics}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Activity className="w-5 h-5" />
              <span className="font-semibold">Refresh Current Prices</span>
            </button>
          </div>

          {/* Holdings Table */}
          {extractedData.holdings && extractedData.holdings.length > 0 && (
            <div>
              <button
                onClick={() => setShowHoldings(!showHoldings)}
                className="flex items-center justify-between w-full font-semibold text-gray-800 mb-3 hover:text-primary-600 transition-colors"
              >
                <span>Holdings ({extractedData.holdings.length})</span>
                {showHoldings ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              
              {showHoldings && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100 border-b border-gray-200">
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Symbol</th>
                        <th className="px-4 py-2 text-right font-semibold text-gray-700">Shares</th>
                        <th className="px-4 py-2 text-right font-semibold text-gray-700">Avg Price</th>
                        <th className="px-4 py-2 text-right font-semibold text-gray-700">Cost Basis</th>
                        <th className="px-4 py-2 text-right font-semibold text-gray-700">Current Price</th>
                        <th className="px-4 py-2 text-right font-semibold text-gray-700">Total Value</th>
                        <th className="px-4 py-2 text-right font-semibold text-gray-700">Gain/Loss</th>
                      </tr>
                    </thead>
                    <tbody>
                      {extractedData.holdings.map((holding, index) => {
                        const totalCost = holding.totalCostBasis || (holding.shares && holding.costBasis ? holding.shares * holding.costBasis : null);
                        return (
                          <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3 font-semibold text-primary-700">{holding.symbol}</td>
                            <td className="px-4 py-3 text-right">{holding.shares}</td>
                            <td className="px-4 py-3 text-right">{formatCurrency(holding.costBasis)}</td>
                            <td className="px-4 py-3 text-right font-semibold text-gray-600">{formatCurrency(totalCost)}</td>
                            <td className="px-4 py-3 text-right">{formatCurrency(holding.currentPrice)}</td>
                            <td className="px-4 py-3 text-right font-semibold">{formatCurrency(holding.totalValue)}</td>
                            <td className={`px-4 py-3 text-right font-semibold ${
                              holding.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {formatCurrency(holding.gainLoss)}
                              <span className="text-xs ml-1">({formatPercent(holding.gainLossPercent)})</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Comprehensive Metrics Calculation */}
      {calculatingMetrics && (
        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-300 flex items-center gap-4">
          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          <div>
            <p className="text-lg font-bold text-blue-900">Calculating Portfolio Performance Metrics...</p>
            <p className="text-sm text-blue-700">
              Fetching historical data and computing Sharpe Ratio, Jensen's Alpha, Treynor Ratio, and more...
            </p>
          </div>
        </div>
      )}

      {/* Display Comprehensive Metrics */}
      {comprehensiveMetrics && (
        <div className="mt-8 animate-fadeIn">
          <RealPortfolioMetrics metricsData={comprehensiveMetrics} />
          
          {/* Save Portfolio Button */}
          {user && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowSaveModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
              >
                <Save className="w-5 h-5" />
                <span className="font-semibold">Save Portfolio to Cloud</span>
              </button>
            </div>
          )}
          
          {!user && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
              <p className="text-sm text-yellow-900">
                <strong>💡 Tip:</strong> Sign in to save your portfolio to the cloud and access it from anywhere!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Save Portfolio Modal */}
      <SavePortfolioModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        portfolioData={{
          extractedData,
          comprehensiveMetrics,
          stdDevData,
          timestamp: new Date().toISOString()
        }}
        onSaved={(savedPortfolio) => {
          console.log('Portfolio saved:', savedPortfolio);
          alert('Portfolio saved successfully!');
        }}
      />

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-900">
          <strong>💡 Tip:</strong> Upload a screenshot or PDF of your brokerage statement. 
          Gemini AI will automatically extract holdings, cost basis, gains/losses, and income data.
          Then we'll automatically calculate professional portfolio metrics using real market data.
        </p>
      </div>
    </div>
  );
};

export default StatementUploader;

