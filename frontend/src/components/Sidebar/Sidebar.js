import React from 'react';

export default function Sidebar({ tab, setTab, isOpen }) {
  const navItems = [
    { id: 'upload',    icon: '📤', label: 'Upload & Analyze', desc: 'Analyze a resume' },
    { id: 'dashboard', icon: '📊', label: 'Dashboard',        desc: 'View all candidates' },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-mobile-open' : ''}`}>
      <div className="sidebar-logo">
        <div className="logo-row">
          <div className="logo-icon">🤖</div>
          <div className="logo-text">
            <h2>ResumeAI</h2>
            <p>Screening & Shortlisting</p>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Main Menu</div>
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${tab === item.id ? 'active' : ''}`}
            onClick={() => setTab(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <div className="nav-item-text">
              <span className="nav-label">{item.label}</span>
              <span className="nav-desc">{item.desc}</span>
            </div>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-badge">
          <span className="footer-dot" />
          All services online
        </div>
        <span>⚡ ML-Powered · NLP Engine</span>
        <span style={{ marginTop: 4 }}>TF-IDF · Cosine Similarity</span>
      </div>
    </aside>
  );
}
