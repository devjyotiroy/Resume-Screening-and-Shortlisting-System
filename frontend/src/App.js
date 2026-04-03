import React, { useState, useEffect, useCallback } from 'react';
import './styles/variables.css';
import './styles/main.css';

import Sidebar     from './components/Sidebar/Sidebar';
import UploadForm  from './components/UploadForm/UploadForm';
import ResultModal from './components/ResultModal/ResultModal';
import Dashboard   from './components/Dashboard/Dashboard';
import Toast       from './components/shared/Toast';

/* ── Landing Hero ── */
function LandingPage({ onEnter }) {
  const features = [
    { icon: '🧠', title: 'AI-Powered Scoring',   desc: 'TF-IDF & Cosine Similarity engine scores every resume intelligently.' },
    { icon: '⚡', title: 'Instant Analysis',      desc: 'Get detailed skill match, project & certification scores in seconds.' },
    { icon: '🎯', title: 'Skills-First Approach', desc: 'Freshers are evaluated on skills & projects — not just experience.' },
    { icon: '📊', title: 'Live Dashboard',        desc: 'Rank, filter and compare all candidates in one place.' },
  ];

  return (
    <div className="landing">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="landing-grid" />

      <div className="landing-content">
        <div className="landing-badge">
          <span className="badge-dot" />
          ML-Powered · NLP · TF-IDF · Cosine Similarity
        </div>

        <h1 className="landing-title">
          Hire Smarter with
          <span className="landing-gradient-text"> AI Resume<br />Screening</span>
        </h1>

        <p className="landing-subtitle">
          Upload resumes, match skills against job descriptions, and rank candidates
          automatically — powered by NLP, TF-IDF and Cosine Similarity.
        </p>

        <div className="landing-cta">
          <button className="btn-hero" onClick={onEnter}>
            <span className="btn-hero-icon">🚀</span>
            Get Started — It's Free
            <span className="btn-hero-arrow">→</span>
          </button>
          <div className="landing-cta-note">✦ No signup required &nbsp;·&nbsp; Works with PDF &amp; DOCX</div>
        </div>

        <div className="landing-features">
          {features.map((f, i) => (
            <div className="landing-feature-card" key={f.title} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="lf-icon">{f.icon}</div>
              <div>
                <div className="lf-title">{f.title}</div>
                <div className="lf-desc">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="landing-stats">
          {[
            { value: '35%', label: 'Weight on Skills' },
            { value: '12%', label: 'Weight on Projects' },
            { value: '55+', label: 'Score to Get Selected' },
            { value: '8',   label: 'Scoring Dimensions' },
          ].map(s => (
            <div className="landing-stat" key={s.label}>
              <div className="ls-value">{s.value}</div>
              <div className="ls-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const PAGE_META = {
  upload:    { title: 'Upload & Analyze', subtitle: 'Submit a resume for ML-powered screening' },
  dashboard: { title: 'Dashboard',        subtitle: 'View and compare all analyzed candidates' },
};

let toastId = 0;

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [tab, setTab]                 = useState('upload');
  const [result, setResult]           = useState(null);
  const [showModal, setShowModal]     = useState(false);
  const [refreshDash, setRefresh]     = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts]           = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') { setShowModal(false); setSidebarOpen(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  return (
    <div className="layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar tab={tab} setTab={(t) => { setTab(t); setSidebarOpen(false); }} isOpen={sidebarOpen} />

      <div className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="hamburger" onClick={() => setSidebarOpen(o => !o)} aria-label="Menu">
              <span /><span /><span />
            </button>
            <div className="topbar-title">
              <h1>{PAGE_META[tab].title}</h1>
              <p>{PAGE_META[tab].subtitle}</p>
            </div>
          </div>
          <div className="topbar-right">
            <div className="topbar-dot" title="Services online" />
            <span className="topbar-badge">🤖 ML Powered</span>
            <button
              className="btn btn-sm btn-outline"
              onClick={() => setShowLanding(true)}
            >
              🏠 Home
            </button>
          </div>
        </header>

        <main className="page" key={tab}>
          {tab === 'upload' && (
            <>
              <UploadForm
                onResult={(data) => { setResult(data); setShowModal(false); }}
                onNewResult={() => setRefresh(r => r + 1)}
                addToast={addToast}
              />
              {result && !showModal && (
                <div className="result-cta-wrap">
                  <button className="btn-result-cta" onClick={() => setShowModal(true)}>
                    <span className="result-cta-icon">📊</span>
                    <div>
                      <div className="result-cta-title">View Full Analysis Report</div>
                      <div className="result-cta-sub">Score, skills, breakdown &amp; recommendation for {result.name}</div>
                    </div>
                    <span className="result-cta-arrow">→</span>
                  </button>
                </div>
              )}
            </>
          )}
          {tab === 'dashboard' && <Dashboard refresh={refreshDash} addToast={addToast} />}
        </main>
      </div>

      {showModal && result && (
        <ResultModal data={result} onClose={() => setShowModal(false)} />
      )}

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
