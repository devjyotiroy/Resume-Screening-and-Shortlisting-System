import React, { useEffect, useState } from 'react';
import ScoreBar from '../shared/ScoreBar';

function getGradeClass(grade) {
  if (!grade) return 'poor';
  const g = grade.toLowerCase();
  if (g === 'excellent') return 'excellent';
  if (g === 'good')      return 'good';
  if (g === 'average')   return 'average';
  if (g.includes('below')) return 'below';
  return 'poor';
}

function ScoreRing({ score }) {
  const [animated, setAnimated] = useState(0);
  const r = 38, circ = 2 * Math.PI * r;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 100);
    return () => clearTimeout(t);
  }, [score]);

  const offset = circ - (animated / 100) * circ;
  const color  = score >= 70 ? '#10b981' : score >= 55 ? '#f59e0b' : '#ef4444';

  return (
    <div className="score-ring-svg-wrap">
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="7" />
        <circle
          cx="48" cy="48" r={r}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 48 48)"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div className="score-ring-text">
        <span className="score-num">{score}</span>
        <span className="score-label">/ 100</span>
      </div>
    </div>
  );
}

export default function ResultModal({ data, onClose }) {
  if (!data) return null;

  const isSelected = data.recommendation === 'Selected';
  const allSkills  = data.all_skills || [];
  const matched    = data.matched_skills || [];
  const missing    = allSkills.filter(
    s => !matched.map(m => m.toLowerCase()).includes(s.toLowerCase())
  );

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">

        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <h3>{data.name}</h3>
            <p>{data.email || 'No email provided'} · Analyzed just now</p>
            <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'center' }}>
              <span className={`grade-badge ${getGradeClass(data.grade)}`}>{data.grade}</span>
              <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Grade</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <ScoreRing score={data.final_score} />
            <button className="modal-close" onClick={onClose} title="Close (Esc)">✕</button>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body">

          {/* Status */}
          <div className={`result-status-bar ${isSelected ? 'selected' : 'rejected'}`}>
            <span style={{ fontSize: '1.1rem' }}>{isSelected ? '✅' : '❌'}</span>
            <span>
              {isSelected
                ? 'Candidate Shortlisted — Score meets the threshold (≥ 55)'
                : 'Candidate Rejected — Score below threshold (< 55)'}
            </span>
          </div>

          {/* Score + Skills grid */}
          <div className="modal-grid">
            <div>
              <div className="section-title">Score Breakdown</div>
              <ScoreBar label="Skill Match"         value={data.skill_score}                           color="" />
              <ScoreBar label="Experience"          value={Math.min((data.experience_years || 0) * 20, 100)} color="green" />
              <ScoreBar label="Education"           value={data.education_score || 0}                  color="green" />
              <ScoreBar label="Keyword Density"     value={data.keyword_score || 0}                    color="orange" />
              <ScoreBar label="Similarity (TF-IDF)" value={(data.similarity_score || 0) * 100}         color="orange" />
              <ScoreBar label="Projects"            value={data.project_score || 0}                    color="" />
              <ScoreBar label="Certifications"      value={data.cert_score || 0}                       color="green" />
              <ScoreBar label="Soft Skills"         value={data.soft_score || 0}                       color="" />
            </div>

            <div>
              <div className="skills-section" style={{ marginBottom: 18 }}>
                <div className="section-title">Matched Skills ({matched.length})</div>
                <div className="skills-list">
                  {matched.length > 0
                    ? matched.map(s => <span key={s} className="skill-tag">✓ {s}</span>)
                    : <span style={{ fontSize: '0.82rem', color: 'var(--gray-400)' }}>No skills matched</span>
                  }
                </div>
              </div>

              {missing.length > 0 && (
                <div className="skills-section" style={{ marginBottom: 18 }}>
                  <div className="section-title">Missing Skills ({missing.length})</div>
                  <div className="skills-list">
                    {missing.map(s => <span key={s} className="skill-tag missing">{s}</span>)}
                  </div>
                </div>
              )}

              <div className="section-title" style={{ marginTop: 8 }}>Quick Stats</div>
              <div className="quick-stats-grid">
                {[
                  { label: 'Experience',  value: `${data.experience_years || 0} yrs` },
                  { label: 'Similarity',  value: `${((data.similarity_score || 0) * 100).toFixed(1)}%` },
                  { label: 'Skills Hit',  value: `${matched.length} / ${allSkills.length}` },
                  { label: 'Final Score', value: `${data.final_score} / 100` },
                ].map(({ label, value }) => (
                  <div key={label} className="quick-stat-card">
                    <div className="qs-label">{label}</div>
                    <div className="qs-value">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Text preview */}
          {data.raw_text_preview && (
            <>
              <div className="divider" />
              <details>
                <summary style={{ cursor: 'pointer', fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600 }}>
                  📄 View Extracted Resume Text Preview
                </summary>
                <p style={{
                  marginTop: 10, fontSize: '0.78rem', color: 'var(--gray-500)',
                  background: 'var(--gray-50)', padding: '12px 14px',
                  borderRadius: 8, lineHeight: 1.7, whiteSpace: 'pre-wrap'
                }}>
                  {data.raw_text_preview}...
                </p>
              </details>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
            <button className="btn btn-outline" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
