import React, { useState, useRef } from 'react';
import axios from 'axios';
import API_ENDPOINTS from '../../config/api';

const STEPS = ['Fill Details', 'Upload Resume', 'Analyzing', 'Done'];

export default function UploadForm({ onResult, onNewResult, addToast }) {
  const [form, setForm]     = useState({ name: '', email: '', job_description: '', job_skills: '' });
  const [file, setFile]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep]     = useState(0);
  const [drag, setDrag]     = useState(false);
  const [error, setError]   = useState('');
  const fileRef             = useRef();

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const validateFile = (f) => {
    if (!f) return 'Please select a file.';
    const ext = f.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx'].includes(ext)) return 'Only PDF or DOCX files are allowed.';
    if (f.size > 10 * 1024 * 1024) return 'File size must be under 10MB.';
    return null;
  };

  const handleFile = (f) => {
    const err = validateFile(f);
    if (err) { addToast(err, 'error'); return; }
    setFile(f);
    setError('');
    setStep(s => Math.max(s, 1));
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleClear = () => {
    setForm({ name: '', email: '', job_description: '', job_skills: '' });
    setFile(null); setError(''); setStep(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fileErr = validateFile(file);
    if (fileErr) { setError(fileErr); return; }
    if (!form.name.trim()) { setError('Candidate name is required.'); return; }
    if (!form.job_description.trim()) { setError('Job description is required.'); return; }

    setLoading(true); setError(''); setStep(2);
    try {
      const fd = new FormData();
      fd.append('resume', file);
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      const res = await axios.post(API_ENDPOINTS.UPLOAD_RESUME, fd);
      setStep(3);
      onResult(res.data);
      onNewResult();
      addToast(`✅ Analysis complete for ${form.name}! View the report below.`, 'success', 5000);
    } catch (err) {
      const msg = err.response?.data?.error || 'Analysis failed. Make sure all services are running.';
      setError(msg);
      addToast(msg, 'error');
      setStep(1);
    }
    setLoading(false);
  };

  const currentStep = loading ? 2 : step;

  return (
    <div className="card upload-card">
      {/* Step indicator */}
      <div className="step-indicator">
        {STEPS.map((s, i) => (
          <div key={s} className={`step-item ${i <= currentStep ? 'step-done' : ''} ${i === currentStep ? 'step-active' : ''}`}>
            <div className="step-circle">
              {i < currentStep ? '✓' : i + 1}
            </div>
            <span className="step-label">{s}</span>
            {i < STEPS.length - 1 && <div className="step-line" />}
          </div>
        ))}
      </div>

      <div className="card-header">
        <div className="card-header-left">
          <h2>📄 Resume Analysis</h2>
          <p>Upload a resume and provide job details to get an AI-powered screening score</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Candidate Name *</label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={form.name}
              onChange={set('name')}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="e.g. john@example.com"
              value={form.email}
              onChange={set('email')}
            />
          </div>

          <div className="form-group full">
            <label>Job Description *</label>
            <textarea
              placeholder="Paste the full job description here. The more detail, the better the analysis..."
              value={form.job_description}
              onChange={set('job_description')}
              required
            />
          </div>

          <div className="form-group full">
            <label>
              Required Skills{' '}
              <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(comma separated)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Python, Machine Learning, SQL, React, AWS"
              value={form.job_skills}
              onChange={set('job_skills')}
            />
          </div>

          <div className="form-group full">
            <label>Resume File *</label>
            <div
              className={`file-upload-area ${file ? 'has-file' : ''} ${drag ? 'drag-over' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.docx"
                style={{ display: 'none' }}
                onChange={e => { if (e.target.files[0]) handleFile(e.target.files[0]); }}
              />
              <div className="file-upload-icon">
                {file ? '✅' : drag ? '📂' : '📁'}
              </div>
              {file ? (
                <>
                  <p className="file-name">📎 {file.name}</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--gray-400)', marginTop: 4 }}>
                    {(file.size / 1024).toFixed(1)} KB · Click to change
                  </p>
                </>
              ) : (
                <>
                  <p><strong>Click to upload</strong> or drag &amp; drop</p>
                  <p style={{ fontSize: '0.75rem', marginTop: 4, color: 'var(--gray-400)' }}>
                    PDF or DOCX · Max 10MB
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {error && <div className="alert error"><span>⚠️</span> {error}</div>}

        <div className="form-actions">
          <button className="btn btn-primary btn-lg" type="submit" disabled={loading}>
            {loading
              ? <><span className="spinner" /> Analyzing Resume...</>
              : <><span>🚀</span> Analyze Resume</>
            }
          </button>
          {!loading && (
            <button type="button" className="btn btn-outline" onClick={handleClear}>
              🗑 Clear
            </button>
          )}
          {loading && (
            <div className="analyzing-hint">
              <span className="spinner dark" />
              <span>ML engine processing — this may take 10–30 seconds...</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
