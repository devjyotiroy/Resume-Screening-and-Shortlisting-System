# Frontend Environment Setup - Quick Guide (Hindi)

## ✅ Kya Kiya Gaya Hai

### 1. Environment Files Banaye Gaye
```
frontend/
├── .env                    # Development ke liye
├── .env.example           # Template
├── .env.production        # Production ke liye
└── .gitignore             # .env ko protect karne ke liye
```

### 2. API Configuration File
```
frontend/src/config/api.js  # Centralized API management
```

### 3. Components Updated
- `UploadForm.js` - Ab environment variable use karta hai
- `Dashboard.js` - Ab environment variable use karta hai

---

## 🚀 Kaise Use Karein

### Development (Local)
```bash
# .env file already configured hai
REACT_APP_API_URL=http://localhost:5000

# Bas start karo
cd frontend
npm start
```

### Production (Hosting ke baad)

#### Step 1: Backend Deploy Karo
```bash
# Render.com, Railway, ya Heroku par deploy karo
# Backend URL milega: https://your-backend.onrender.com
```

#### Step 2: Frontend .env.production Update Karo
```bash
# frontend/.env.production file kholo
# Backend URL update karo:
REACT_APP_API_URL=https://your-backend.onrender.com
```

#### Step 3: Frontend Deploy Karo
```bash
cd frontend
npm run build

# Vercel par:
vercel --prod

# Ya Netlify par:
netlify deploy --prod --dir=build
```

---

## 📝 Environment Variables

### Development (.env)
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ML_SERVICE_URL=http://localhost:5001
REACT_APP_NAME=ResumeAI
REACT_APP_VERSION=1.0.0
REACT_APP_ENABLE_DEBUG=true
```

### Production (.env.production)
```env
REACT_APP_API_URL=https://your-backend-url.com
REACT_APP_ML_SERVICE_URL=https://your-ml-service-url.com
REACT_APP_NAME=ResumeAI
REACT_APP_VERSION=1.0.0
REACT_APP_ENABLE_DEBUG=false
```

---

## 🔧 Important Notes

### 1. Environment Variable Rules
- Naam hamesha `REACT_APP_` se start hona chahiye
- `.env` file change karne ke baad server restart karo
- Production mein hosting platform par set karo

### 2. Security
- `.env` file ko kabhi Git par commit mat karo
- `.gitignore` already configured hai
- Sensitive data ko environment variables mein rakho

### 3. API Configuration
```javascript
// Ab ye use karo:
import API_ENDPOINTS from '../../config/api';

// API call:
axios.get(API_ENDPOINTS.GET_ALL_RESUMES)
axios.post(API_ENDPOINTS.UPLOAD_RESUME, formData)
axios.delete(API_ENDPOINTS.DELETE_RESUME(id))
```

---

## 🎯 Deployment Flow

```
1. Backend Deploy Karo
   ↓
   Backend URL milega
   ↓
2. Frontend .env.production Update Karo
   ↓
   Backend URL paste karo
   ↓
3. Frontend Build Karo
   ↓
   npm run build
   ↓
4. Frontend Deploy Karo
   ↓
   Vercel/Netlify par
   ↓
5. Done! ✅
```

---

## 🧪 Testing

### Local Testing
```bash
# Backend start karo
cd backend
npm run dev

# Frontend start karo (new terminal)
cd frontend
npm start

# Test karo: http://localhost:3000
```

### Production Testing
```bash
# Backend check karo
curl https://your-backend-url.com/health

# Frontend check karo
# Browser mein kholo: https://your-frontend-url.com

# Resume upload try karo
# Dashboard check karo
```

---

## ❌ Common Errors

### Error 1: API_URL undefined
```
Solution: 
- Check .env file mein REACT_APP_API_URL hai
- Server restart karo
- npm start fir se run karo
```

### Error 2: CORS Error
```
Solution:
- Backend mein CORS enable karo
- Frontend URL ko backend CORS mein add karo
```

### Error 3: 404 Not Found
```
Solution:
- Backend URL check karo
- Backend running hai ya nahi check karo
- .env.production mein sahi URL hai ya nahi
```

---

## 📁 Files Created

1. **frontend/.env** - Development configuration
2. **frontend/.env.example** - Template for team
3. **frontend/.env.production** - Production configuration
4. **frontend/.gitignore** - Protect sensitive files
5. **frontend/src/config/api.js** - API configuration
6. **DEPLOYMENT_GUIDE.md** - Complete deployment guide
7. **FRONTEND_ENV_GUIDE_HINDI.md** - This file

---

## ✅ Checklist

### Development
- [x] .env file created
- [x] API_URL configured
- [x] Components updated
- [x] Local testing working

### Production
- [ ] Backend deployed
- [ ] Backend URL copied
- [ ] .env.production updated
- [ ] Frontend built
- [ ] Frontend deployed
- [ ] Live testing done

---

## 🎉 Summary

**Development**: ✅ Ready  
**Production**: 🚀 Ready to deploy  
**Environment**: ✅ Configured  
**Security**: ✅ Protected  

**Ab aap backend host karne ke baad sirf .env.production file mein URL update karke frontend deploy kar sakte ho!**

---

**Created**: Abhi  
**Status**: ✅ Complete  
**Language**: Hindi + English
