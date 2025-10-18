#!/bin/bash
# Test Portfolio Standard Deviation Calculator

echo "🧪 Testing Portfolio Standard Deviation Calculator"
echo "=================================================="
echo ""

# Test 1: Tech Portfolio
echo "📊 TEST 1: Tech Portfolio (AAPL 40%, MSFT 30%, GOOGL 30%)"
curl -s -X POST http://localhost:3001/api/calculate-portfolio-stddev \
  -H "Content-Type: application/json" \
  -d '{"holdings":[{"symbol":"AAPL","weight":0.4},{"symbol":"MSFT","weight":0.3},{"symbol":"GOOGL","weight":0.3}]}' | \
  python3 -c "import sys,json; d=json.load(sys.stdin); print(f\"Portfolio Std Dev: {d['data']['portfolioStdDevPercent']:.2f}%\")"
echo ""

# Test 2: Balanced Portfolio
echo "📊 TEST 2: Balanced Portfolio (AAPL 25%, MSFT 25%, JNJ 25%, PG 25%)"
curl -s -X POST http://localhost:3001/api/calculate-portfolio-stddev \
  -H "Content-Type: application/json" \
  -d '{"holdings":[{"symbol":"AAPL","weight":0.25},{"symbol":"MSFT","weight":0.25},{"symbol":"JNJ","weight":0.25},{"symbol":"PG","weight":0.25}]}' | \
  python3 -c "import sys,json; d=json.load(sys.stdin); print(f\"Portfolio Std Dev: {d['data']['portfolioStdDevPercent']:.2f}%\")"
echo ""

# Test 3: High Volatility
echo "📊 TEST 3: High Vol Portfolio (TSLA 50%, NVDA 50%)"
curl -s -X POST http://localhost:3001/api/calculate-portfolio-stddev \
  -H "Content-Type: application/json" \
  -d '{"holdings":[{"symbol":"TSLA","weight":0.5},{"symbol":"NVDA","weight":0.5}]}' | \
  python3 -c "import sys,json; d=json.load(sys.stdin); print(f\"Portfolio Std Dev: {d['data']['portfolioStdDevPercent']:.2f}%\")"
echo ""

echo "✅ All tests complete!"

