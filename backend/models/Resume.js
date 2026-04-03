const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, default: '' },
  filename: { type: String, required: true },
  job_description: { type: String, default: '' },
  job_skills: { type: String, default: '' },
  matched_skills: { type: [String], default: [] },
  all_skills: { type: [String], default: [] },
  experience_years: { type: Number, default: 0 },
  education_score: { type: Number, default: 0 },
  cert_score: { type: Number, default: 0 },
  project_score: { type: Number, default: 0 },
  keyword_score: { type: Number, default: 0 },
  soft_score: { type: Number, default: 0 },
  similarity_score: { type: Number, default: 0 },
  skill_score: { type: Number, default: 0 },
  exp_score: { type: Number, default: 0 },
  final_score: { type: Number, default: 0 },
  grade: { type: String, default: '' },
  rank: { type: Number, default: 0 },
  recommendation: { type: String, default: 'Pending' },
  raw_text_preview: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'resumes'
});

// Index for faster queries
resumeSchema.index({ final_score: -1 });
resumeSchema.index({ createdAt: -1 });
resumeSchema.index({ name: 1 });

module.exports = mongoose.model('Resume', resumeSchema);
