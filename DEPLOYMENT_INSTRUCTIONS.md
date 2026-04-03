# DEPLOYMENT INSTRUCTIONS

## EXACT DEPLOYMENT ORDER

### STEP 1: Deploy ML Service (Render)
```
1. Go to Render.com → New → Web Service
2. Connect GitHub repo
3. Root Directory: ml-service
4. Build Command: pip install -r requirements.txt
5. Start Command: python app.py
6. Environment Variables:
   PORT=5001
   FLASK_ENV=production
7. Deploy
8. COPY ML SERVICE URL: https://your-ml-service.onrender.com
```

### STEP 2: Update Backend .env
```
ML_SERVICE_URL=https://your-ml-service.onrender.com
```

### STEP 3: Deploy Backend (Render)
```
1. Render.com → New → Web Service
2. Root Directory: backend
3. Build Command: npm install
4. Start Command: npm start
5. Environment Variables:
   MONGO_URI=mongodb+srv://devjyotiroy:resumeanalyzer@cluster0.lilyfcj.mongodb.net/resume_screening?retryWrites=true&w=majority
   PORT=5000
   ML_SERVICE_URL=https://your-ml-service.onrender.com
6. Deploy
7. COPY BACKEND URL: https://your-backend.onrender.com
```

### STEP 4: Update Frontend .env.production
```
REACT_APP_API_URL=https://your-backend.onrender.com
```

### STEP 5: Deploy Frontend (Vercel)
```
1. Vercel.com → Import Project
2. Root Directory: frontend
3. Framework: Create React App
4. Build Command: npm run build
5. Output Directory: build
6. Environment Variables:
   REACT_APP_API_URL=https://your-backend.onrender.com
7. Deploy
```

## VERIFICATION

### Test ML Service
```bash
curl https://your-ml-service.onrender.com/health
# Expected: {"status":"ok","service":"ML Resume Analyzer"}
```

### Test Backend
```bash
curl https://your-backend.onrender.com/health
# Expected: {"status":"ok","service":"Resume Screening Backend"}
```

### Test Frontend
```
Open: https://your-frontend.vercel.app
Upload resume → Check dashboard
```

## CHANGES MADE

### Created Files:
1. ml-service/.env
2. ml-service/.env.example
3. ml-service/.gitignore
4. backend/.env.example
5. backend/.gitignore
6. .gitignore (root)
7. DEPLOYMENT_INSTRUCTIONS.md

### Verified (No Changes Needed):
- backend/config/index.js → Uses process.env.ML_SERVICE_URL ✓
- backend/routes/resume.js → Uses ML_SERVICE_URL from config ✓
- frontend/src/config/api.js → Uses process.env.REACT_APP_API_URL ✓
- backend/.env → Has MONGO_URI, PORT, ML_SERVICE_URL ✓
- frontend/.env → Has REACT_APP_API_URL ✓

## URL USAGE MAP

### ML Service (Port 5001)
- Used by: backend/routes/resume.js
- Variable: ML_SERVICE_URL
- Endpoint: /analyze

### Backend (Port 5000)
- Used by: frontend/src/config/api.js
- Variable: REACT_APP_API_URL
- Endpoints: /api/resume/upload, /api/resume/all, /api/resume/:id

### MongoDB Atlas
- Used by: backend/server.js
- Variable: MONGO_URI
- Database: resume_screening

## FINAL ARCHITECTURE

```
Frontend (Vercel)
    ↓ REACT_APP_API_URL
Backend (Render)
    ↓ ML_SERVICE_URL
ML Service (Render)
    ↓
MongoDB Atlas
```

## GIT COMMANDS

```bash
# Initialize (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for deployment"

# Add remote
git remote add origin https://github.com/yourusername/resume-screening.git

# Push
git push -u origin main
```

## CORS VERIFICATION

Backend already has CORS enabled:
```javascript
app.use(cors());
```

For production, update to:
```javascript
app.use(cors({
  origin: ['https://your-frontend.vercel.app'],
  credentials: true
}));
```
