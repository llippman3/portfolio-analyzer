import React from 'react';
import { Download, Printer, Share2 } from 'lucide-react';

const ExportResults = ({ results, portfolioData }) => {
  const generateReport = () => {
    const date = new Date().toLocaleDateString();
    return `
PORTFOLIO PERFORMANCE ANALYSIS REPORT
Generated: ${date}
========================================

INPUT PARAMETERS:
-----------------
Portfolio Return: ${(portfolioData.portfolioReturn * 100).toFixed(2)}%
Risk-Free Rate: ${(portfolioData.riskFreeRate * 100).toFixed(2)}%
Standard Deviation: ${(portfolioData.standardDeviation * 100).toFixed(2)}%
Beta: ${portfolioData.beta.toFixed(2)}
Market Return: ${(portfolioData.marketReturn * 100).toFixed(2)}%
Risk Tolerance: ${portfolioData.riskTolerance}

PERFORMANCE METRICS:
-------------------
Sharpe Ratio: ${results.sharpeRatio.toFixed(4)}
  - Rating: ${results.sharpeFeedback.rating}
  - Interpretation: ${results.sharpeFeedback.message}

Treynor Ratio: ${results.treynorRatio.toFixed(4)}
  - Measures excess return per unit of systematic risk

Jensen's Alpha: ${(results.jensensAlpha * 100).toFixed(4)}%
  - Rating: ${results.alphaFeedback.rating}
  - Interpretation: ${results.alphaFeedback.message}

${results.futureValue ? `
FUTURE VALUE PROJECTION:
------------------------
Initial Investment: $${portfolioData.presentValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
Investment Horizon: ${results.years} years
Projected Value: $${results.futureValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
Total Growth: $${(results.futureValue - portfolioData.presentValue).toLocaleString('en-US', { minimumFractionDigits: 2 })}
` : ''}

KEY RECOMMENDATIONS:
-------------------
${results.sharpeRatio < 1 || results.jensensAlpha < 0 ? 
`⚠ CONSIDER: Based on your metrics, you may benefit from low-cost benchmark funds.
  These typically offer:
  - Lower expense ratios (<0.20%)
  - Instant diversification
  - Automatic rebalancing
  - Tax efficiency
  
  Recommended for ${portfolioData.riskTolerance} risk tolerance:
  - Check the benchmark comparison section of your report` :
`✓ CONTINUE: Your portfolio shows strong risk-adjusted performance.
  Keep monitoring and maintain your investment discipline.`}

========================================
Disclaimer: This analysis is for educational purposes only and does not 
constitute financial advice. Consult a qualified financial advisor before 
making investment decisions.
`;
  };

  const handleDownload = () => {
    const report = generateReport();
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-analysis-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const report = generateReport();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Portfolio Performance Analysis',
          text: report
        });
      } catch (err) {
        // User cancelled or error occurred
        console.log('Share cancelled or error:', err);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(report);
        alert('Report copied to clipboard!');
      } catch (err) {
        alert('Unable to copy report. Please use the download button instead.');
      }
    }
  };

  return (
    <div className="card bg-gradient-to-br from-gray-50 to-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Export Your Results</h3>
      
      <div className="grid md:grid-cols-3 gap-4">
        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-md hover:shadow-lg"
        >
          <Download className="w-5 h-5" />
          <span className="font-semibold">Download Report</span>
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all shadow-md hover:shadow-lg print:hidden"
        >
          <Printer className="w-5 h-5" />
          <span className="font-semibold">Print Report</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
        >
          <Share2 className="w-5 h-5" />
          <span className="font-semibold">Share/Copy</span>
        </button>
      </div>

      <p className="text-xs text-gray-600 mt-4 text-center">
        Save your analysis for future reference or share with your financial advisor
      </p>
    </div>
  );
};

export default ExportResults;




