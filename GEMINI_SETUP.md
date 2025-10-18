# 🤖 Gemini AI Setup Guide

Enable automatic brokerage statement parsing with Google's Gemini AI.

## 📋 What You'll Get

Upload a screenshot of your brokerage statement and automatically extract:
- ✅ Total portfolio value
- ✅ Total cost basis
- ✅ Unrealized gain/loss
- ✅ Income earned (dividends)
- ✅ Individual holdings with symbols, shares, prices
- ✅ Calculated portfolio return

## 🔑 Step 1: Get a Gemini API Key

### Free Tier
Google offers generous free tier for Gemini API:
- **1,500 requests per day** (free)
- **1 million tokens per minute**
- Perfect for personal use!

### Get Your Key:

1. Go to **[Google AI Studio](https://aistudio.google.com/app/apikey)**

2. Click **"Get API Key"** or **"Create API Key"**

3. Select or create a Google Cloud project

4. Copy your API key (starts with `AIza...`)

## ⚙️ Step 2: Configure the Backend

### Option A: Environment Variable (Recommended)

**Mac/Linux:**
```bash
cd /Users/lucaslippman/wealthmanagement/server
export GEMINI_API_KEY="your-api-key-here"
node index.js
```

**Or add to your shell profile** (~/.zshrc or ~/.bashrc):
```bash
export GEMINI_API_KEY="your-api-key-here"
```

**Windows (Command Prompt):**
```cmd
cd C:\path\to\wealthmanagement\server
set GEMINI_API_KEY=your-api-key-here
node index.js
```

**Windows (PowerShell):**
```powershell
cd C:\path\to\wealthmanagement\server
$env:GEMINI_API_KEY="your-api-key-here"
node index.js
```

### Option B: Direct Code Edit (For Testing Only)

Edit `server/index.js` line 18:

```javascript
// Change from:
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_API_KEY_HERE';

// To:
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaYourActualKeyHere';
```

**⚠️ Warning:** Don't commit your API key to git! Add it to `.gitignore` if using this method.

### Option C: Create .env File

1. Create `.env` file in `/server/` directory:
```bash
cd /Users/lucaslippman/wealthmanagement/server
touch .env
```

2. Add your key:
```
GEMINI_API_KEY=your-api-key-here
```

3. Install dotenv:
```bash
npm install dotenv
```

4. Update `server/index.js` (top of file):
```javascript
import 'dotenv/config';
import express from 'express';
// ... rest of code
```

## 🚀 Step 3: Install Dependencies

```bash
cd /Users/lucaslippman/wealthmanagement/server
npm install
```

This installs:
- `@google/generative-ai` - Gemini SDK
- `multer` - File upload handling

## ✅ Step 4: Verify Setup

### Start the server:
```bash
cd /Users/lucaslippman/wealthmanagement/server
node index.js
```

### Look for:
```
🚀 Yahoo Finance API Server running on http://localhost:3001
📊 Available endpoints:
   ...
   - POST /api/parse-statement (with file upload)
   ...
🤖 Gemini AI: ✅ Configured
```

If you see **❌ Not configured**, the API key isn't set properly.

### Test the health endpoint:
```bash
curl http://localhost:3001/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "...",
  "geminiConfigured": true  ← Should be true!
}
```

## 📸 Step 5: Test Statement Upload

1. Open http://localhost:5173 in your browser

2. Scroll to **"Upload Brokerage Statement"** section

3. Take a screenshot of a brokerage statement or use a sample

4. Click to upload or drag & drop

5. Click **"Parse Statement"**

6. Wait for Gemini AI to analyze (5-10 seconds)

7. See extracted data!

## 📊 What Statements Work Best

### ✅ Good Formats:
- Screenshots of online brokerage accounts
- PDF statements from Robinhood, Fidelity, Schwab, etc.
- Clear, high-resolution images
- Full account summary visible
- Holdings table visible

### ❌ Avoid:
- Blurry or low-resolution images
- Partial screenshots missing key data
- Heavily watermarked images
- Multi-page PDFs (upload summary page only)

## 🎯 Example Statement Layout

Best results when statement shows:
```
Account Summary
Total Value: $50,000
Cost Basis: $40,000
Gain/Loss: $10,000 (25%)

Holdings:
Symbol | Shares | Price | Value | Gain/Loss
AAPL   | 100    | $150  | $15K  | +$5K
MSFT   | 50     | $300  | $15K  | +$3K
...
```

## 💰 API Costs

### Free Tier:
- **1,500 requests/day** - Free
- **Gemini 2.5 Flash-Lite**: Best for this use case
- Each statement parse = 1 request

### Pricing (if you exceed free tier):
- **Gemini 2.5 Flash-Lite**: $0.075 per 1M input tokens
- **Typical statement**: ~2,000 tokens
- **Cost per parse**: ~$0.00015 (essentially free!)

For personal use, you'll **never hit the limit**.

## 🛠️ Troubleshooting

### "Gemini API key not configured"
- Check your API key is set correctly
- Restart the server after setting env variable
- Verify with: `echo $GEMINI_API_KEY` (should show your key)

### "Failed to parse statement"
- Check image is clear and readable
- Ensure statement contains numerical data
- Try a different format (PNG vs JPG)
- Check server logs for detailed error

### "Cannot read property 'text' of undefined"
- API key might be invalid
- Check you copied the full key
- Regenerate key in Google AI Studio

### Rate Limit Errors
- You've exceeded 1,500 requests/day
- Wait 24 hours or upgrade to paid tier
- Each upload counts as 1 request

## 🔒 Security Notes

1. **Never commit API keys** to git
2. Use environment variables in production
3. Add `.env` to `.gitignore`
4. Rotate keys periodically
5. Monitor usage in Google Cloud Console

## 📚 Additional Resources

- [Google AI Studio](https://aistudio.google.com/)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Pricing Details](https://ai.google.dev/pricing)
- [Rate Limits](https://ai.google.dev/docs/rate_limits)

## 🎉 You're All Set!

Once configured, you can:
1. Upload any brokerage statement
2. Get instant data extraction
3. Auto-populate your portfolio form
4. Calculate metrics with real data

**No more manual data entry!** 🚀

---

**Need help?** Check the server logs or main README.md



