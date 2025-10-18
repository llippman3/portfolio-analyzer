import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
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
  const [results, setResults] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [returnsData, setReturnsData] = useState(null);
  const [autoFillData, setAutoFillData] = useState(null);

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

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-24">
          <div className="flex items-center justify-between mb-16">
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <nav className="flex gap-12 text-sm tracking-widest uppercase">
              <a href="#analysis" className="text-neutral-400 hover:text-black transition-colors">Analysis</a>
              <a href="#metrics" className="text-neutral-400 hover:text-black transition-colors">Metrics</a>
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
              <button 
                onClick={() => document.getElementById('portfolio-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary"
              >
                Analyze Now
              </button>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-full border-4 border-black overflow-hidden bg-neutral-100 flex items-center justify-center">
                <TrendingUp className="w-32 h-32 text-black" strokeWidth={1} />
              </div>
            </div>
          </div>
        </header>

        <div className="section-divider"></div>

        {/* Live Market Data Widget */}
        <div className="mb-16">
          <LiveMarketData onAutoFill={setAutoFillData} />
        </div>

        <div className="section-divider"></div>

        {/* Stock Quote Tester */}
        <div className="mb-16">
          <StockQuote />
        </div>

        <div className="section-divider"></div>

        {/* Statement Uploader - Gemini AI */}
        <div className="mb-16">
          <StatementUploader 
            onDataExtracted={(data) => {
              // Auto-fill form with extracted data
              if (data.calculatedReturn) {
                setAutoFillData({
                  portfolioReturn: data.calculatedReturn.toFixed(2)
                });
              }
            }}
          />
        </div>

        <div className="section-divider"></div>

        {/* Input Form */}
        <div id="portfolio-form" className="mb-16">
          <PortfolioForm onCalculate={handleCalculate} autoFillData={autoFillData} />
        </div>

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

        {/* Cash Flow Analysis Section */}
        <div className="mb-16">
          <div className="mb-8 p-8 bg-black text-white rounded-none">
            <h3 className="text-2xl font-light mb-4 tracking-wide">Advanced: Calculate Dollar & Time-Weighted Returns</h3>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Track your deposits and withdrawals to see how your investment timing affected your actual returns.
            </p>
          </div>
          <CashFlowInput onCalculateReturns={handleCalculateReturns} />
        </div>

        {/* Returns Display */}
        {returnsData && (
          <>
            <div className="section-divider"></div>
            <div id="returns-section" className="mb-16 animate-fadeIn scroll-mt-8">
              <ReturnsDisplay
                dollarWeightedReturn={returnsData.dollarWeightedReturn}
                timeWeightedReturn={returnsData.timeWeightedReturn}
                cashFlows={returnsData.cashFlows}
              />
            </div>
          </>
        )}

        <div className="section-divider"></div>

        {/* Educational Content */}
        <div className="mb-16">
          <EducationalContent />
        </div>

        <div className="section-divider"></div>

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

