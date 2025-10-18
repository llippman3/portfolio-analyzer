/**
 * Portfolio Performance Calculation Utilities
 */

/**
 * Calculate Sharpe Ratio
 * @param {number} portfolioReturn - Portfolio return (as decimal, e.g., 0.10 for 10%)
 * @param {number} riskFreeRate - Risk-free rate (as decimal)
 * @param {number} standardDeviation - Portfolio standard deviation (as decimal)
 * @returns {number} Sharpe Ratio
 */
export const calculateSharpeRatio = (portfolioReturn, riskFreeRate, standardDeviation) => {
  if (standardDeviation === 0) return 0;
  return (portfolioReturn - riskFreeRate) / standardDeviation;
};

/**
 * Calculate Treynor Ratio
 * @param {number} portfolioReturn - Portfolio return (as decimal)
 * @param {number} riskFreeRate - Risk-free rate (as decimal)
 * @param {number} beta - Portfolio beta
 * @returns {number} Treynor Ratio
 */
export const calculateTreynorRatio = (portfolioReturn, riskFreeRate, beta) => {
  if (beta === 0) return 0;
  return (portfolioReturn - riskFreeRate) / beta;
};

/**
 * Calculate Jensen's Alpha
 * @param {number} portfolioReturn - Portfolio return (as decimal)
 * @param {number} riskFreeRate - Risk-free rate (as decimal)
 * @param {number} marketReturn - Market return (as decimal)
 * @param {number} beta - Portfolio beta
 * @returns {number} Jensen's Alpha
 */
export const calculateJensensAlpha = (portfolioReturn, riskFreeRate, marketReturn, beta) => {
  return portfolioReturn - (riskFreeRate + (marketReturn - riskFreeRate) * beta);
};

/**
 * Calculate Future Value
 * @param {number} presentValue - Present value (initial investment)
 * @param {number} returnRate - Annual return rate (as decimal)
 * @param {number} years - Number of years
 * @returns {number} Future Value
 */
export const calculateFutureValue = (presentValue, returnRate, years) => {
  return presentValue * Math.pow(1 + returnRate, years);
};

/**
 * Calculate Dollar-Weighted Return (Internal Rate of Return)
 * Uses Newton-Raphson method to approximate IRR
 * @param {Array} cashFlows - Array of cash flows [{date: Date, amount: number}]
 * @param {number} initialGuess - Initial guess for IRR (default 0.1)
 * @returns {number} Dollar-weighted return (as decimal)
 */
export const calculateDollarWeightedReturn = (cashFlows, initialGuess = 0.1) => {
  if (cashFlows.length === 0) return 0;
  
  // Sort cash flows by date
  const sortedFlows = [...cashFlows].sort((a, b) => a.date - b.date);
  const startDate = sortedFlows[0].date;
  
  // Convert dates to years from start
  const flowsWithYears = sortedFlows.map(cf => ({
    amount: cf.amount,
    years: (cf.date - startDate) / (365.25 * 24 * 60 * 60 * 1000)
  }));
  
  // Newton-Raphson method
  let rate = initialGuess;
  const maxIterations = 100;
  const tolerance = 0.0001;
  
  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let dnpv = 0;
    
    flowsWithYears.forEach(cf => {
      const factor = Math.pow(1 + rate, cf.years);
      npv += cf.amount / factor;
      dnpv -= cf.years * cf.amount / (factor * (1 + rate));
    });
    
    if (Math.abs(npv) < tolerance) break;
    
    rate = rate - npv / dnpv;
  }
  
  return rate;
};

/**
 * Calculate Time-Weighted Return
 * @param {Array} periodReturns - Array of period returns (as decimals)
 * @returns {number} Time-weighted return (as decimal)
 */
export const calculateTimeWeightedReturn = (periodReturns) => {
  if (periodReturns.length === 0) return 0;
  
  let twr = 1;
  periodReturns.forEach(r => {
    twr *= (1 + r);
  });
  
  return twr - 1;
};

/**
 * Get performance feedback based on Sharpe Ratio
 * @param {number} sharpeRatio - The calculated Sharpe Ratio
 * @returns {object} Feedback object with rating and message
 */
export const getSharpeRatioFeedback = (sharpeRatio) => {
  if (sharpeRatio < 0) {
    return {
      rating: 'Poor',
      message: 'Your portfolio is underperforming the risk-free rate. Consider rebalancing or switching to benchmark funds.',
      color: 'red'
    };
  } else if (sharpeRatio < 1) {
    return {
      rating: 'Below Average',
      message: 'Your risk-adjusted returns are suboptimal. Review your asset allocation and consider benchmark alternatives.',
      color: 'orange'
    };
  } else if (sharpeRatio < 2) {
    return {
      rating: 'Good',
      message: 'Your portfolio shows good risk-adjusted performance. Continue monitoring and consider minor optimizations.',
      color: 'yellow'
    };
  } else if (sharpeRatio < 3) {
    return {
      rating: 'Very Good',
      message: 'Excellent risk-adjusted returns! Your portfolio is performing well above average.',
      color: 'green'
    };
  } else {
    return {
      rating: 'Exceptional',
      message: 'Outstanding performance! Your risk-adjusted returns are exceptional.',
      color: 'green'
    };
  }
};

/**
 * Get performance feedback based on Jensen's Alpha
 * @param {number} alpha - The calculated Jensen's Alpha
 * @returns {object} Feedback object with rating and message
 */
export const getAlphaFeedback = (alpha) => {
  const alphaPercent = alpha * 100;
  
  if (alphaPercent < -2) {
    return {
      rating: 'Underperforming',
      message: 'Significant negative alpha suggests poor management. Consider switching to passive index funds.',
      color: 'red'
    };
  } else if (alphaPercent < 0) {
    return {
      rating: 'Below Market',
      message: 'Negative alpha indicates underperformance vs. market. Benchmark funds may be a better option.',
      color: 'orange'
    };
  } else if (alphaPercent < 1) {
    return {
      rating: 'Market Performance',
      message: 'Alpha near zero suggests you\'re matching the market. Index funds might offer similar returns with lower fees.',
      color: 'yellow'
    };
  } else if (alphaPercent < 3) {
    return {
      rating: 'Outperforming',
      message: 'Positive alpha shows value added through management. Keep up the good work!',
      color: 'green'
    };
  } else {
    return {
      rating: 'Exceptional',
      message: 'Strong positive alpha indicates excellent portfolio management and security selection.',
      color: 'green'
    };
  }
};

/**
 * Benchmark funds data
 */
export const BENCHMARK_FUNDS = {
  'Ultra Conservative': [
    { symbol: 'VASIX', name: 'Vanguard LifeStrategy Income Fund', allocation: '20% Equities, 80% Bonds' },
    { symbol: 'AOK', name: 'iShares Core Conservative Allocation ETF', allocation: '30% Equities, 70% Bonds' }
  ],
  'Conservative': [
    { symbol: 'VSCGX', name: 'Vanguard LifeStrategy Conservative Growth Fund', allocation: '40% Equities, 60% Bonds' },
    { symbol: 'AOM', name: 'iShares Core Moderate Allocation ETF', allocation: '40% Equities, 60% Bonds' }
  ],
  'Moderate': [
    { symbol: 'VSMGX', name: 'Vanguard LifeStrategy Moderate Growth Fund', allocation: '60% Equities, 40% Bonds' },
    { symbol: 'AOR', name: 'iShares Core Growth Allocation ETF', allocation: '60% Equities, 40% Bonds' }
  ],
  'Aggressive': [
    { symbol: 'VASGX', name: 'Vanguard LifeStrategy Growth Fund', allocation: '80% Equities, 20% Bonds' },
    { symbol: 'AOA', name: 'iShares Core Aggressive Allocation ETF', allocation: '80% Equities, 20% Bonds' }
  ]
};

