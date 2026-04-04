# 🚀 RENDER DEPLOYMENT STEPS

## STEP 1: Deploy ML Service

1. Go to **Render.com** → Sign in
2. Click **New +** → **Web Service**
3. Connect your **GitHub repository**
4. Configure:
   - **Name**: `resume-ml-service`
   - **Root Directory**: `ml-service`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`
   - **Instance Type**: Free

5. **Environment Variables** (Add these):
   ```
   PORT = 5001
   FLASK_ENV = production
   ```

6. Click **Create Web Service**
7. Wait for deployment (5-10 minutes)
8. **COPY ML SERVICE URL**: `https://resume-ml-service-xxxx.onrender.com`

---

## STEP 2: Deploy Backend

1. Render.com → **New +** → **Web Service**
2. Same GitHub repo
3. Configure:
   - **Name**: `resume-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

4. **Environment Variables** (Add these):
   ```
   PORT = 5000
   
   MONGO_URI = mongodb+srv://devjyotiroy:resumeanalyzer@cluster0.lilyfcj.mongodb.net/resume_screening?retryWrites=true&w=majority
   
   ML_SERVICE_URL = https://resume-ml-service-xxxx.onrender.com
   (Paste ML URL from Step 1)
   ```

5. Click **Create Web Service**
6. Wait for deployment
7. **COPY BACKEND URL**: `https://resume-backend-xxxx.onrender.com`

---

## STEP 3: Deploy Frontend

1. Render.com → **New +** → **Static Site**
2. Same GitHub repo
3. Configure:
   - **Name**: `resume-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

4. **Environment Variables** (Add these):
   ```
   REACT_APP_API_URL = https://resume-backend-xxxx.onrender.com
   (Paste Backend URL from Step 2)
   ```

5. Click **Create Static Site**
6. Wait for deployment
7. **OPEN FRONTEND URL**: `https://resume-frontend-xxxx.onrender.com`

---

## ✅ VERIFICATION

### Test ML Service:
```
https://resume-ml-service-xxxx.onrender.com/health
Should show: {"status":"ok","service":"ML Resume Analyzer"}
```

### Test Backend:
```
https://resume-backend-xxxx.onrender.com/health
Should show: {"status":"ok","service":"Resume Screening Backend"}
```

### Test Frontend:
```
Open: https://resume-frontend-xxxx.onrender.com
Try uploading a resume
Check dashboard
```

---

## 📝 IMPORTANT NOTES

1. **Free tier sleeps after 15 min inactivity**
   - First request may take 30-60 seconds
   - Keep services active or upgrade

2. **MongoDB Atlas**
   - Already configured in backend .env
   - Network Access: Allow 0.0.0.0/0

3. **CORS**
   - Already configured to accept all origins
   - Works with Render URLs

4. **File Uploads**
   - Temporary storage on Render
   - Files deleted after processing

---

## 🔧 IF DEPLOYMENT FAILS

### ML Service Issues:
- Check Python version (3.9+)
- Verify requirements.txt exists
- Check logs in Render dashboard

### Backend Issues:
- Verify MongoDB URI is correct
- Check ML_SERVICE_URL is set
- Ensure PORT is 5000

### Frontend Issues:
- Check REACT_APP_API_URL is set
- Verify build command runs locally
- Check for console errors

---

## 🎉 DONE!

Your Resume Screening System is now live on Render!

**ML Service**: https://resume-ml-service-xxxx.onrender.com  
**Backend**: https://resume-backend-xxxx.onrender.com  
**Frontend**: https://resume-frontend-xxxx.onrender.com
