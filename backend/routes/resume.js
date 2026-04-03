const express    = require('express');
const axios      = require('axios');
const FormData   = require('form-data');
const fs         = require('fs');
const Resume     = require('../models/Resume');
const upload     = require('../middleware/upload');
const { ML_SERVICE_URL } = require('../config');

const router = express.Router();

// POST /api/resume/upload
router.post('/upload', upload.single('resume'), async (req, res, next) => {
  try {
    const { name, email, job_description, job_skills } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Candidate name is required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Resume file is required' });
    }

    console.log(`📄 Processing resume for: ${name}`);

    const form = new FormData();
    form.append('resume', fs.createReadStream(req.file.path), req.file.originalname);
    form.append('job_description', job_description || '');
    form.append('job_skills',      job_skills      || '');

    console.log('🤖 Sending to ML service...');
    const mlRes = await axios.post(`${ML_SERVICE_URL}/analyze`, form, {
      headers: form.getHeaders(),
      timeout: 60000,
    });

    const d = mlRes.data;
    console.log(`✅ ML Analysis complete. Score: ${d.final_score}`);

    // Save to MongoDB
    const resume = await Resume.create({
      name: name.trim(),
      email: email?.trim() || '',
      filename: req.file.originalname,
      job_description: job_description || '',
      job_skills: job_skills || '',
      matched_skills: d.matched_skills || [],
      all_skills: d.all_skills || [],
      experience_years: d.experience_years || 0,
      education_score: d.education_score || 0,
      cert_score: d.cert_score || 0,
      project_score: d.project_score || 0,
      keyword_score: d.keyword_score || 0,
      soft_score: d.soft_score || 0,
      similarity_score: d.similarity_score || 0,
      skill_score: d.skill_score || 0,
      exp_score: d.exp_score || 0,
      final_score: d.final_score || 0,
      grade: d.grade || '',
      recommendation: d.recommendation || 'Pending',
      raw_text_preview: d.raw_text_preview || '',
    });

    console.log(`💾 Saved to MongoDB with ID: ${resume._id}`);

    res.json({ 
      ...d, 
      _id: resume._id, 
      name: resume.name, 
      email: resume.email, 
      createdAt: resume.createdAt 
    });
  } catch (err) {
    console.error('❌ Upload error:', err.message);
    const msg = err.response?.data?.error || err.message || 'Analysis failed';
    next({ status: 500, message: msg });
  }
});

// GET /api/resume/all
router.get('/all', async (req, res, next) => {
  try {
    console.log('📊 Fetching all resumes from MongoDB...');
    const resumes = await Resume.find().sort({ final_score: -1 }).lean();
    const ranked  = resumes.map((r, i) => ({ ...r, rank: i + 1 }));
    console.log(`✅ Found ${ranked.length} resumes`);
    res.json(ranked);
  } catch (err) {
    console.error('❌ Fetch error:', err.message);
    next(err);
  }
});

// GET /api/resume/:id
router.get('/:id', async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.json(resume);
  } catch (err) {
    console.error('❌ Get resume error:', err.message);
    next(err);
  }
});

// DELETE /api/resume/:id
router.delete('/:id', async (req, res, next) => {
  try {
    console.log(`🗑️ Deleting resume: ${req.params.id}`);
    const resume = await Resume.findByIdAndDelete(req.params.id);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    console.log(`✅ Deleted: ${resume.name}`);
    res.json({ message: 'Deleted successfully', name: resume.name });
  } catch (err) {
    console.error('❌ Delete error:', err.message);
    next(err);
  }
});

// GET /api/resume/stats/summary
router.get('/stats/summary', async (req, res, next) => {
  try {
    const total = await Resume.countDocuments();
    const selected = await Resume.countDocuments({ recommendation: 'Selected' });
    const rejected = await Resume.countDocuments({ recommendation: 'Rejected' });
    
    const avgScoreResult = await Resume.aggregate([
      { $group: { _id: null, avgScore: { $avg: '$final_score' } } }
    ]);
    const avgScore = avgScoreResult[0]?.avgScore || 0;

    const topScoreResult = await Resume.findOne().sort({ final_score: -1 });
    const topScore = topScoreResult?.final_score || 0;

    res.json({
      total,
      selected,
      rejected,
      avgScore: Math.round(avgScore * 10) / 10,
      topScore
    });
  } catch (err) {
    console.error('❌ Stats error:', err.message);
    next(err);
  }
});

module.exports = router;
