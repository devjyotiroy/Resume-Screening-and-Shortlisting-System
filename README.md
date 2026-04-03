# Resume Screening System - Run Guide

## Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB (running locally on port 27017)

---

## Step 1: Start MongoDB
Make sure MongoDB is running on your machine.
If installed, open a terminal and run:
```
mongod
```

---

## Step 2: Start ML Service (Python Flask)

Open a NEW terminal:
```
cd ml-service
pip install -r requirements.txt
python app.py
```
Runs on: http://localhost:5001

---

## Step 3: Start Backend (Node.js)

Open a NEW terminal:
```
cd backend
npm install
npm run dev
```
Runs on: http://localhost:5000

---

## Step 4: Start Frontend (React)

Open a NEW terminal:
```
cd frontend
npm start
```
Opens on: http://localhost:3000

---

## How to Use

1. Open http://localhost:3000
2. Go to "Upload & Analyze" tab
3. Fill in:
   - Candidate Name
   - Email
   - Job Description (paste full JD)
   - Required Skills (e.g. Python, ML, SQL)
   - Upload PDF or DOCX resume
4. Click "Analyze Resume"
5. See Score, Recommendation, Matched Skills
6. Go to "Dashboard" tab → Click "Load All Candidates" to see ranked list

---

## Scoring Formula
Final Score = 0.30 × Skill Match + 0.20 × Experience + 0.15 × Education + 0.10 × Certifications + 0.10 × Projects + 0.15 × Similarity

Score >= 60 → Selected
Score < 60  → Rejected
