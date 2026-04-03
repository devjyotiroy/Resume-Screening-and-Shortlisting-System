# 🚀 Deployment Guide - Resume Screening System

## ✅ Environment Variables Setup Complete

### Frontend `.env` Files Created:

1. **`.env`** - Development (Local)
2. **`.env.example`** - Template for team
3. **`.env.production`** - Production deployment

---

## 📁 File Structure

```
frontend/
├── .env                    # Development (gitignored)
├── .env.example           # Template (committed to git)
├── .env.production        # Production template
└── src/
    └── config/
        └── api.js         # Centralized API configuration
```

---

## 🔧 Configuration Files

### 1. Development (`.env`)
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ML_SERVICE_URL=http://localhost:5001
REACT_APP_NAME=ResumeAI
REACT_APP_VERSION=1.0.0
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_DEBUG=true
```

### 2. Production (`.env.production`)
```env
REACT_APP_API_URL=https://your-backend-url.com
REACT_APP_ML_SERVICE_URL=https://your-ml-service-url.com
REACT_APP_NAME=ResumeAI
REACT_APP_VERSION=1.0.0
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_DEBUG=false
```

---

## 🚀 Deployment Steps

### Step 1: Deploy Backend First

#### Option A: Render.com (Recommended)
```bash
1. Create account on Render.com
2. New → Web Service
3. Connect GitHub repository
4. Configure:
   - Build Command: cd backend && npm install
   - Start Command: cd backend && npm start
   - Environment Variables:
     * MONGO_URI=mongodb+srv://...
     * PORT=5000
     * ML_SERVICE_URL=http://localhost:5001
5. Deploy
6. Copy your backend URL: https://your-app.onrender.com
```

#### Option B: Railway.app
```bash
1. Create account on Railway.app
2. New Project → Deploy from GitHub
3. Select backend folder
4. Add Environment Variables:
   - MONGO_URI
   - PORT
   - ML_SERVICE_URL
5. Deploy
6. Copy your backend URL
```

#### Option C: Heroku
```bash
1. Install Heroku CLI
2. heroku login
3. cd backend
4. heroku create your-app-name
5. heroku config:set MONGO_URI="mongodb+srv://..."
6. git push heroku main
7. Copy URL: https://your-app-name.herokuapp.com
```

### Step 2: Update Frontend `.env.production`

```env
# Replace with your actual backend URL
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

### Step 3: Deploy Frontend

#### Option A: Vercel (Recommended for React)
```bash
1. Install Vercel CLI: npm i -g vercel
2. cd frontend
3. vercel login
4. vercel

# Or via Vercel Dashboard:
1. Import GitHub repository
2. Framework: Create React App
3. Root Directory: frontend
4. Environment Variables:
   - REACT_APP_API_URL=https://your-backend-url.com
5. Deploy
```

#### Option B: Netlify
```bash
1. cd frontend
2. npm run build
3. Drag & drop 'build' folder to Netlify
4. Or connect GitHub:
   - Build command: npm run build
   - Publish directory: build
   - Environment Variables:
     * REACT_APP_API_URL=https://your-backend-url.com
```

#### Option C: GitHub Pages
```bash
1. Add to package.json:
   "homepage": "https://yourusername.github.io/resume-screening"

2. Install gh-pages:
   npm install --save-dev gh-pages

3. Add scripts:
   "predeploy": "npm run build",
   "deploy": "gh-pages -d build"

4. Deploy:
   npm run deploy
```

---

## 🔐 Environment Variables Guide

### Backend Environment Variables

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# Server Port
PORT=5000

# ML Service URL
ML_SERVICE_URL=http://localhost:5001
# Or if ML service is also hosted:
# ML_SERVICE_URL=https://your-ml-service-url.com
```

### Frontend Environment Variables

```env
# Backend API URL (REQUIRED)
REACT_APP_API_URL=https://your-backend-url.com

# ML Service URL (Optional - usually accessed via backend)
REACT_APP_ML_SERVICE_URL=https://your-ml-service-url.com

# App Info
REACT_APP_NAME=ResumeAI
REACT_APP_VERSION=1.0.0

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_DEBUG=false
```

---

## 📝 Pre-Deployment Checklist

### Backend
- [ ] MongoDB Atlas cluster is running
- [ ] Network Access allows all IPs (0.0.0.0/0)
- [ ] Database user has correct permissions
- [ ] `.env` file has correct MONGO_URI
- [ ] All dependencies in `package.json`
- [ ] `npm start` works locally
- [ ] Health endpoint works: `/health`

### Frontend
- [ ] `.env.production` has correct backend URL
- [ ] API calls use `API_ENDPOINTS` from config
- [ ] `npm run build` works without errors
- [ ] Build folder is created
- [ ] No hardcoded localhost URLs
- [ ] CORS is enabled on backend

### ML Service
- [ ] Python dependencies in `requirements.txt`
- [ ] Flask app runs on port 5001
- [ ] `/analyze` endpoint works
- [ ] Can process PDF and DOCX files

---

## 🧪 Testing After Deployment

### 1. Test Backend
```bash
# Health check
curl https://your-backend-url.com/health

# Expected: {"status":"ok","service":"Resume Screening Backend"}

# Get all resumes
curl https://your-backend-url.com/api/resume/all

# Expected: [] or array of resumes
```

### 2. Test Frontend
```bash
1. Open: https://your-frontend-url.com
2. Click "Get Started"
3. Try uploading a resume
4. Check if data appears in dashboard
5. Verify MongoDB has the data
```

### 3. Test Full Flow
```bash
1. Upload resume via frontend
2. Check backend logs for processing
3. Verify ML service analyzed the resume
4. Check MongoDB for saved data
5. View in dashboard
6. Try deleting a candidate
```

---

## 🔧 Common Deployment Issues

### Issue 1: CORS Error
```
Access to fetch at 'https://backend.com' from origin 'https://frontend.com' 
has been blocked by CORS policy
```

**Solution**: Update backend CORS configuration
```javascript
// backend/server.js
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend-url.com',
    'https://your-frontend-url.vercel.app'
  ],
  credentials: true
}));
```

### Issue 2: Environment Variables Not Working
```
API_URL is undefined
```

**Solution**: 
1. Ensure variables start with `REACT_APP_`
2. Restart development server after changing `.env`
3. For production, set in hosting platform dashboard
4. Rebuild: `npm run build`

### Issue 3: 404 on API Calls
```
GET https://your-backend-url.com/api/resume/all 404
```

**Solution**:
1. Check backend is deployed and running
2. Verify backend URL in `.env.production`
3. Check backend routes are correct
4. Test backend health endpoint

### Issue 4: MongoDB Connection Failed
```
MongoServerError: Authentication failed
```

**Solution**:
1. Check MONGO_URI in backend environment variables
2. Verify MongoDB Atlas Network Access (0.0.0.0/0)
3. Check database user credentials
4. Ensure database name is in connection string

### Issue 5: Build Fails
```
npm run build fails with errors
```

**Solution**:
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install`
3. Fix any import errors
4. Check for unused variables (warnings)
5. Run `npm run build` again

---

## 📊 Hosting Platform Comparison

| Platform | Backend | Frontend | Free Tier | Best For |
|----------|---------|----------|-----------|----------|
| **Render** | ✅ | ✅ | Yes (limited) | Full-stack apps |
| **Vercel** | ❌ | ✅ | Yes (generous) | React/Next.js |
| **Netlify** | ❌ | ✅ | Yes (generous) | Static sites |
| **Railway** | ✅ | ✅ | Yes ($5 credit) | Node.js apps |
| **Heroku** | ✅ | ✅ | No (paid only) | Enterprise |
| **AWS** | ✅ | ✅ | Yes (12 months) | Scalable apps |

---

## 🎯 Recommended Setup

### For Development:
```
Frontend: http://localhost:3000
Backend: http://localhost:5000
ML Service: http://localhost:5001
MongoDB: MongoDB Atlas (Cloud)
```

### For Production:
```
Frontend: Vercel (https://your-app.vercel.app)
Backend: Render (https://your-api.onrender.com)
ML Service: Render (https://your-ml.onrender.com)
MongoDB: MongoDB Atlas (Cloud)
```

---

## 📝 Quick Deploy Commands

### Deploy Backend to Render
```bash
1. Push code to GitHub
2. Connect Render to GitHub
3. Auto-deploy on push
```

### Deploy Frontend to Vercel
```bash
cd frontend
vercel --prod
```

### Deploy Frontend to Netlify
```bash
cd frontend
npm run build
netlify deploy --prod --dir=build
```

---

## 🔒 Security Best Practices

### 1. Environment Variables
```bash
# Never commit .env files
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.production" >> .gitignore
```

### 2. API Keys
```bash
# Use environment variables for all secrets
# Never hardcode API keys or passwords
```

### 3. CORS
```javascript
// Only allow specific origins in production
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));
```

### 4. MongoDB
```bash
# Use strong passwords
# Restrict IP access in production
# Enable authentication
```

---

## ✅ Final Checklist

### Before Going Live:
- [ ] All environment variables set correctly
- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] MongoDB connection working
- [ ] ML service running (if separate)
- [ ] CORS configured properly
- [ ] All API endpoints tested
- [ ] Error handling in place
- [ ] Loading states working
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Analytics setup (optional)
- [ ] Domain configured (optional)

---

## 📞 Support Resources

### Documentation:
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs
- Netlify: https://docs.netlify.com
- MongoDB Atlas: https://docs.atlas.mongodb.com

### Community:
- Stack Overflow
- GitHub Issues
- Discord/Slack communities

---

## 🎉 Success!

Your Resume Screening System is now ready for deployment!

**Development**: ✅ Working locally  
**Production**: 🚀 Ready to deploy  
**Environment**: ✅ Configured  

**Next Steps**:
1. Deploy backend to Render/Railway
2. Update frontend `.env.production` with backend URL
3. Deploy frontend to Vercel/Netlify
4. Test the live application
5. Share with users!

---

**Created**: Now  
**Status**: ✅ Ready for Deployment  
**Version**: 1.0.0
