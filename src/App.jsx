import React, { useState } from 'react';
import { TrendingUp, BarChart3, User, LogOut, Loader, LogIn } from 'lucide-react';
import PortfolioForm from './components/PortfolioForm';
import MetricsDisplay from './components/MetricsDisplay';
import BenchmarkComparison from './components/BenchmarkComparison';
import EducationalContent from './components/EducationalContent';
import PerformanceCharts from './components/PerformanceCharts';
import CashFlowInput from './components/CashFlowInput';
import ReturnsDisplay from './components/ReturnsDisplay';
import ExportResults from './components/ExportResults';
import LiveMarketData from './components/LiveMarketData';
import StockQuote from './components/StockQuote';
import StatementUploader from './components/StatementUploader';
import BenchmarkPortfolios from './components/BenchmarkPortfolios';
import SavedPortfolios from './components/SavedPortfolios';
import AuthPage from './components/Auth/AuthPage';
import { useAuth } from './contexts/AuthContext';
import {
  calculateSharpeRatio,
  calculateTreynorRatio,
  calculateJensensAlpha,
  calculateFutureValue,
  calculateDollarWeightedReturn,
  calculateTimeWeightedReturn,
  getSharpeRatioFeedback,
  getAlphaFeedback
} from './utils/calculations';

function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [results, setResults] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [returnsData, setReturnsData] = useState(null);
  const [autoFillData, setAutoFillData] = useState(null);
  const [activeTab, setActiveTab] = useState('portfolio');
  const [comprehensiveMetrics, setComprehensiveMetrics] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loadedPortfolioData, setLoadedPortfolioData] = useState(null);

  const handleCalculate = (data) => {
    const sharpeRatio = calculateSharpeRatio(
      data.portfolioReturn,
      data.riskFreeRate,
      data.standardDeviation
    );

    const treynorRatio = calculateTreynorRatio(
      data.portfolioReturn,
      data.riskFreeRate,
      data.beta
    );

    const jensensAlpha = calculateJensensAlpha(
      data.portfolioReturn,
      data.riskFreeRate,
      data.marketReturn,
      data.beta
    );

    const sharpeFeedback = getSharpeRatioFeedback(sharpeRatio);
    const alphaFeedback = getAlphaFeedback(jensensAlpha);

    let futureValue = null;
    if (data.presentValue && data.years) {
      futureValue = calculateFutureValue(
        data.presentValue,
        data.portfolioReturn,
        data.years
      );
    }

    const calculatedResults = {
      sharpeRatio,
      treynorRatio,
      jensensAlpha,
      futureValue,
      sharpeFeedback,
      alphaFeedback,
      portfolioReturn: data.portfolioReturn,
      beta: data.beta,
      years: data.years
    };

    setResults(calculatedResults);
    setPortfolioData(data);

    // Smooth scroll to results
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handleCalculateReturns = (data) => {
    const dwr = calculateDollarWeightedReturn(data.cashFlows);
    const twr = calculateTimeWeightedReturn(data.periodReturns);

    setReturnsData({
      dollarWeightedReturn: dwr,
      timeWeightedReturn: twr,
      cashFlows: data.cashFlows
    });

    // Smooth scroll to returns
    setTimeout(() => {
      document.getElementById('returns-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-24">
          <div className="flex items-center justify-between mb-16">
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <nav className="flex items-center gap-12 text-sm tracking-widest uppercase">
              <button 
                onClick={() => setActiveTab('portfolio')}
                className={`transition-colors ${
                  activeTab === 'portfolio' ? 'text-black font-semibold' : 'text-neutral-400 hover:text-black'
                }`}
              >
                Portfolio
              </button>
              {user && (
                <button 
                  onClick={() => setActiveTab('saved')}
                  className={`transition-colors ${
                    activeTab === 'saved' ? 'text-black font-semibold' : 'text-neutral-400 hover:text-black'
                  }`}
                >
                  My Portfolios
                </button>
              )}
              <button 
                onClick={() => setActiveTab('benchmarks')}
                className={`transition-colors ${
                  activeTab === 'benchmarks' ? 'text-black font-semibold' : 'text-neutral-400 hover:text-black'
                }`}
              >
                Benchmarks
              </button>
              
              {/* User Menu / Sign In */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 text-neutral-400 hover:text-black transition-colors"
                  >
                    <User className="w-5 h-5" />
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">Signed in as</p>
                        <p className="text-sm text-gray-600 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-2 text-neutral-400 hover:text-black transition-colors"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </button>
              )}
            </nav>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-6xl md:text-7xl font-light mb-8 leading-tight">
                Portfolio Performance
              </h1>
              <p className="text-sm uppercase tracking-widest text-neutral-400 mb-8">
                Professional Wealth Analysis
              </p>
              <p className="text-lg text-neutral-600 leading-relaxed mb-8">
                Evaluate your investment returns with institutional-grade metrics and discover if benchmark funds might serve you better. Make data-driven decisions about your financial future.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-full border-4 border-black overflow-hidden bg-neutral-100 flex items-center justify-center">
                <TrendingUp className="w-32 h-32 text-black" strokeWidth={1} />
              </div>
            </div>
          </div>
        </header>

        {/* Tab Content */}
        {activeTab === 'portfolio' && (
          <>
            <div className="section-divider"></div>

            {/* Live Market Data Widget */}
            <div className="mb-16">
              <LiveMarketData onAutoFill={setAutoFillData} />
            </div>

            <div className="section-divider"></div>

            {/* Statement Uploader - Gemini AI */}
            <div className="mb-16">
              {loadedPortfolioData && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-900">📂 Loaded Portfolio: {loadedPortfolioData.portfolio_name}</p>
                    <p className="text-xs text-blue-700">Saved on {new Date(loadedPortfolioData.created_at).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => {
                      setLoadedPortfolioData(null);
                      setComprehensiveMetrics(null);
                    }}
                    className="text-sm px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                  >
                    Clear & Upload New
                  </button>
                </div>
              )}
              
              <StatementUploader 
                onDataExtracted={(data) => {
                  // Auto-fill form with extracted data
                  if (data.calculatedReturn) {
                    setAutoFillData({
                      portfolioReturn: data.calculatedReturn.toFixed(2)
                    });
                  }
                  // Clear loaded portfolio when uploading new data
                  setLoadedPortfolioData(null);
                }}
                onMetricsCalculated={(metrics) => {
                  setComprehensiveMetrics(metrics);
                }}
                initialData={loadedPortfolioData?.portfolio_data}
              />
            </div>
          </>
        )}

        {activeTab === 'saved' && (
          <SavedPortfolios 
            onLoadPortfolio={(portfolio) => {
              console.log('Loading portfolio:', portfolio);
              
              // Load the portfolio data (will be passed to StatementUploader as initialData)
              setLoadedPortfolioData(portfolio);
              
              // Switch to portfolio tab to view the loaded data
              setActiveTab('portfolio');
              
              // Smooth scroll to the top
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 100);
            }}
          />
        )}

        {activeTab === 'benchmarks' && (
          <BenchmarkPortfolios userPortfolioMetrics={comprehensiveMetrics} />
        )}

        {activeTab === 'portfolio' && (
          <>
            <div className="section-divider" id="portfolio-form"></div>

            {/* Results Section */}
            {results && (
              <div id="results-section" className="space-y-16 scroll-mt-8">
                <div className="section-divider"></div>
                
                {/* Metrics Display */}
                <div className="animate-fadeIn">
                  <MetricsDisplay results={results} />
                </div>

                <div className="section-divider"></div>

                {/* Performance Charts */}
                <div className="animate-fadeIn">
                  <PerformanceCharts 
                    portfolioMetrics={{
                      ...results,
                      portfolioReturn: portfolioData.portfolioReturn,
                      standardDeviation: portfolioData.standardDeviation,
                      presentValue: portfolioData.presentValue,
                      years: portfolioData.years
                    }}
                    benchmarkReturn={portfolioData.marketReturn * 100}
                  />
                </div>

                <div className="section-divider"></div>

                {/* Benchmark Comparison */}
                <div className="animate-fadeIn">
                  <BenchmarkComparison 
                    riskTolerance={portfolioData.riskTolerance}
                    portfolioMetrics={results}
                  />
                </div>

                <div className="section-divider"></div>

                {/* Export Results */}
                <div className="animate-fadeIn">
                  <ExportResults results={results} portfolioData={portfolioData} />
                </div>
              </div>
            )}

            <div className="section-divider"></div>

            {/* Stock Quote Tester */}
            <div className="mb-16">
              <StockQuote />
            </div>

            <div className="section-divider"></div>
          </>
        )}

        {/* Footer */}
        <footer className="text-center text-neutral-500 pt-16 pb-8">
          <p className="text-sm mb-4 leading-relaxed max-w-2xl mx-auto">
            <strong className="text-black">Disclaimer:</strong> This tool is for educational purposes only and does not constitute financial advice. 
            Past performance does not guarantee future results. Consult with a qualified financial advisor before making investment decisions.
          </p>
          <p className="text-xs mt-8 text-neutral-400 uppercase tracking-widest">
            © 2025 Portfolio Performance Analyzer
          </p>
        </footer>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="p-6">
              <AuthPage onSuccess={() => setShowAuthModal(false)} />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;

