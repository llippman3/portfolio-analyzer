# 📍 Where to Find Portfolio Standard Deviation

## 🔄 First: Refresh Your Browser!

**Press:** `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows/Linux)

This does a hard refresh and loads the new code.

## 📍 Location on Website:

### Step 1: Open the Site
```
http://localhost:5173
```

### Step 2: Scroll Down
Scroll past:
- ✅ Header "Portfolio Performance Analyzer"
- ✅ "Live Market Data" section
- ✅ "Stock Quote Lookup" section

### Step 3: Find "Upload Brokerage Statement"
Look for the section with:
- 📄 File icon
- **"Upload Brokerage Statement"**
- "Powered by Gemini AI"
- Blue upload box

### Step 4: Upload a Statement
1. Click the upload box or drag & drop
2. Select a screenshot/PDF
3. Click **"Parse Statement"** button
4. Wait 5-10 seconds

### Step 5: See Standard Deviation! 📊

After parsing completes, **scroll down** in that same section and you'll see:

```
✅ Statement parsed successfully!

💰 Summary cards (Total Value, Cost Basis, etc.)

📊 PORTFOLIO STANDARD DEVIATION  ← HERE IT IS!
[Purple box with big percentage]
24.82%
Based on 1-year historical data

Individual Stock Volatilities:
- AAPL (40%): 32.53%
- MSFT (30%): 24.82%
...

✨ Diversification Benefit
Risk Reduction: 5.33%

📊 Stock Correlations
AAPL ↔ MSFT: 0.519
```

## 🎨 What It Looks Like:

### The Upload Section:
```
┌─────────────────────────────────────┐
│ 📄 Upload Brokerage Statement       │
│    Powered by Gemini AI             │
├─────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐ │
│  │     📤                         │ │
│  │  Click to upload or drag drop │ │
│  │  PNG, JPG, or PDF (Max 10MB)  │ │
│  └────────────────────────────────┘ │
│                                      │
│  [ Parse Statement ]  ← Click this  │
└─────────────────────────────────────┘
```

### After Upload (Scroll Down):
```
┌─────────────────────────────────────┐
│ ✅ Statement parsed successfully!   │
├─────────────────────────────────────┤
│ Total Value: $50,000                │
│ Cost Basis: $40,000                 │
│ ...                                 │
├─────────────────────────────────────┤
│ 📊 Portfolio Standard Deviation     │ ← NEW!
│                                      │
│        24.82%                       │
│ Based on 1-year historical data     │
│                                      │
│ Individual Stock Volatilities:      │
│ - AAPL (40%): 32.53%               │
│ - MSFT (30%): 24.82%               │
│                                      │
│ ✨ Diversification Benefit          │
│ Risk Reduction: 5.33%               │
└─────────────────────────────────────┘
```

## 🚨 If You Still Don't See It:

### Option 1: Hard Refresh
```bash
# In browser:
Mac: Cmd + Shift + R
Windows/Linux: Ctrl + Shift + R
```

### Option 2: Clear Cache & Reload
```bash
# In browser:
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"
```

### Option 3: Restart Frontend
```bash
# Kill and restart:
kill 80419
cd /Users/lucaslippman/wealthmanagement
npm run dev
```

Then refresh browser at http://localhost:5173

## 🧪 Quick Test Without Statement:

Don't have a statement handy? Test with the script:

```bash
cd /Users/lucaslippman/wealthmanagement
./test_stddev.sh
```

This calls the API directly and shows:
```
📊 TEST 1: Tech Portfolio (AAPL 40%, MSFT 30%, GOOGL 30%)
Portfolio Std Dev: 24.82%

📊 TEST 2: Balanced Portfolio (AAPL 25%, MSFT 25%, JNJ 25%, PG 25%)
Portfolio Std Dev: 15.44%

📊 TEST 3: High Vol Portfolio (TSLA 50%, NVDA 50%)
Portfolio Std Dev: 51.60%
```

## 📱 Mobile View:

On mobile, the standard deviation section will be below the holdings table. Just keep scrolling after the statement is parsed!

## ✅ Checklist:

- [ ] Browser refreshed with Cmd+Shift+R
- [ ] At http://localhost:5173
- [ ] Scrolled to "Upload Brokerage Statement" section
- [ ] Uploaded a file and clicked "Parse Statement"
- [ ] Waited for "✅ Statement parsed successfully!"
- [ ] Scrolled down to see the purple "Portfolio Standard Deviation" box

## 🎯 Still Can't Find It?

Check browser console (F12) for any errors. The feature is definitely there in the code - just uploaded!



