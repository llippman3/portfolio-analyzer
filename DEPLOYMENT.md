# Deployment Guide - Railway

This guide will help you deploy the Portfolio Performance Analyzer to Railway in under 5 minutes.

## Prerequisites

- GitHub account
- Railway account (free tier available at [railway.app](https://railway.app))
- Your Gemini API key

## Step-by-Step Deployment

### 1. Push to GitHub

```bash
# Make sure you're in the project directory
cd wealthmanagement

# Make initial commit (if not already done)
git add -A
git commit -m "Initial commit - Portfolio Performance Analyzer"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 2. Deploy Backend to Railway

1. Go to [railway.app](https://railway.app) and sign in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository
5. Railway will detect two services - select the **backend (server)**
6. Configure the backend:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`

7. **Add Environment Variables** (click Variables tab):
   - `GEMINI_API_KEY`: Your Gemini API key (from server/.env file)
   - `PORT`: Leave empty (Railway auto-assigns)

8. Wait for deployment to complete
9. Copy the backend URL (e.g., `https://your-app.railway.app`)

### 3. Deploy Frontend to Railway

1. In the same Railway project, click **"New Service"**
2. Select **"Deploy from GitHub repo"** (same repo)
3. Configure the frontend:
   - Root Directory: `.` (root)
   - Build Command: `npm install && npm run build`
   - Start Command: Leave empty
   - Static Output Directory: `dist`

4. **Add Environment Variable**:
   - `VITE_API_URL`: Your backend URL + `/api` (e.g., `https://your-backend.railway.app/api`)

5. Wait for deployment to complete
6. Click the generated URL to view your live site! 🎉

## Alternative: Single-Click Deploy (Coming Soon)

We're working on a Railway template for one-click deployment.

## Environment Variables Summary

### Backend (`server`)
- `GEMINI_API_KEY` - Required for AI statement parsing
- `PORT` - Auto-assigned by Railway (or 3001 locally)

### Frontend (root)
- `VITE_API_URL` - Backend API URL (e.g., `https://your-backend.railway.app/api`)

## Updating Your Deployment

After making changes:

```bash
git add .
git commit -m "Your update message"
git push
```

Railway will automatically redeploy! 🚀

## Troubleshooting

### Backend won't start
- Check that `GEMINI_API_KEY` is set in Railway environment variables
- Check deployment logs for errors

### Frontend can't connect to backend
- Verify `VITE_API_URL` is set correctly with `/api` suffix
- Check that backend is deployed and running
- Ensure CORS is enabled in backend (already configured)

### Need help?
Check Railway's documentation or the app logs in the Railway dashboard.

---

**Security Note**: Never commit your `.env` file or expose your API keys. Railway handles environment variables securely.

