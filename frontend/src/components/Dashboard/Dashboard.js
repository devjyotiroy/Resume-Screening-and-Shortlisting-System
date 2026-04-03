import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ResultModal from '../ResultModal/ResultModal';
import API_ENDPOINTS from '../../config/api';

function getRankClass(rank) {
  if (rank === 1) return 'gold';
  if (rank === 2) return 'silver';
  if (rank === 3) return 'bronze';
  return 'default';
}

function getGradeClass(grade) {
  if (!grade) return 'poor';
  const g = grade.toLowerCase();
  if (g === 'excellent') return 'excellent';
  if (g === 'good')      return 'good';
  if (g === 'average')   return 'average';
  if (g.includes('below')) return 'below';
  return 'poor';
}

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  const raf = useRef();
  useEffect(() => {
    const target = parseFloat(value) || 0;
    const start  = 0;
    const dur    = 800;
    const startTime = performance.now();
    const tick = (now) => {
      const p = Math.min((now - startTime) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(+(start + (target - start) * ease).toFixed(1));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value]);
  return <>{display}</>;
}

function exportCSV(candidates) {
  const headers = ['Rank', 'Name', 'Email', 'Score', 'Grade', 'Experience (yrs)', 'Matched Skills', 'Status'];
  const rows = candidates.map(c => [
    c.rank, c.name, c.email || '',
    c.final_score, c.grade || '',
    c.experience_years ?? '',
    (c.matched_skills || []).join('; '),
    c.recommendation,
  ]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = 'candidates.csv'; a.click();
  URL.revokeObjectURL(url);
}

export default function Dashboard({ refresh, addToast }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [loaded, setLoaded]         = useState(false);
  const [search, setSearch]         = useState('');
  const [filter, setFilter]         = useState('all');
  const [sortBy, setSortBy]         = useState('score');
  const [selected, setSelected]     = useState(null);

  const fetchAll = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await axios.get(API_ENDPOINTS.GET_ALL_RESUMES);
      setCandidates(res.data);
      setLoaded(true);
      if (!silent) addToast(`Loaded ${res.data.length} candidate(s)`, 'success');
    } catch {
      addToast('Failed to load candidates. Is the backend running?', 'error');
    }
    setLoading(false);
  };

  // Auto-load on mount
  useEffect(() => { fetchAll(true); }, []);
  // Refresh when new resume analyzed
  useEffect(() => { if (loaded && refresh > 0) fetchAll(true); }, [refresh]);

  const deleteCandidate = async (id, name) => {
    if (!window.confirm(`Remove ${name} from the list?`)) return;
    try {
      await axios.delete(API_ENDPOINTS.DELETE_RESUME(id));
      setCandidates(prev => prev.filter(c => c._id !== id));
      addToast(`${name} removed successfully`, 'info');
    } catch {
      addToast('Failed to delete candidate', 'error');
    }
  };

  const total    = candidates.length;
  const selCount = candidates.filter(c => c.recommendation === 'Selected').length;
  const rejCount = candidates.filter(c => c.recommendation === 'Rejected').length;
  const avgScore = total ? (candidates.reduce((a, c) => a + c.final_score, 0) / total).toFixed(1) : 0;
  const topScore = total ? Math.max(...candidates.map(c => c.final_score)) : 0;

  const filtered = candidates
    .filter(c => {
      const matchSearch = c.name?.toLowerCase().includes(search.toLowerCase()) ||
                          c.email?.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === 'all' ||
        (filter === 'selected' && c.recommendation === 'Selected') ||
        (filter === 'rejected' && c.recommendation === 'Rejected');
      return matchSearch && matchFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.final_score - a.final_score;
      if (sortBy === 'name')  return a.name.localeCompare(b.name);
      if (sortBy === 'exp')   return (b.experience_years || 0) - (a.experience_years || 0);
      return 0;
    });

  return (
    <>
      {selected && <ResultModal data={selected} onClose={() => setSelected(null)} />}

      {/* Stats */}
      {loaded && total > 0 && (
        <div className="stats-grid">
          {[
            { icon: '👥', color: 'blue',   label: 'Total Candidates', value: total },
            { icon: '✅', color: 'green',  label: 'Shortlisted',      value: selCount },
            { icon: '❌', color: 'red',    label: 'Rejected',         value: rejCount },
            { icon: '📈', color: 'purple', label: 'Average Score',    value: avgScore },
            { icon: '🏆', color: 'orange', label: 'Top Score',        value: topScore },
          ].map(s => (
            <div className="stat-card" key={s.label}>
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div className="stat-info">
                <p>{s.label}</p>
                <h3><AnimatedNumber value={s.value} /></h3>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div className="card-header-left">
            <h2>🏆 Candidate Rankings</h2>
            <p>Sorted by final ML score — highest to lowest</p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {loaded && total > 0 && (
              <button className="btn btn-sm btn-outline" onClick={() => exportCSV(filtered)}>
                📥 Export CSV
              </button>
            )}
            <button className="btn btn-primary btn-sm" onClick={() => fetchAll()} disabled={loading}>
              {loading ? <><span className="spinner" /> Loading...</> : '🔄 Refresh'}
            </button>
          </div>
        </div>

        {/* Search + Filter + Sort */}
        {loaded && total > 0 && (
          <div className="filter-bar">
            <div className="search-input-wrap">
              <span className="search-icon">🔍</span>
              <input
                placeholder="Search by name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select className="filter-select" value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="all">All Candidates</option>
              <option value="selected">Shortlisted Only</option>
              <option value="rejected">Rejected Only</option>
            </select>
            <select className="filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="score">Sort: Score</option>
              <option value="name">Sort: Name</option>
              <option value="exp">Sort: Experience</option>
            </select>
            <span style={{ fontSize: '0.78rem', color: 'var(--gray-400)', whiteSpace: 'nowrap' }}>
              {filtered.length} of {total} shown
            </span>
          </div>
        )}

        {!loaded && loading && (
          <div className="empty-state">
            <div className="empty-icon"><span className="spinner dark" style={{ width: 36, height: 36, borderWidth: 4 }} /></div>
            <p>Loading candidates...</p>
          </div>
        )}

        {loaded && total === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🗂️</div>
            <p>No candidates found. Upload and analyze resumes first.</p>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Candidate</th>
                  <th>Final Score</th>
                  <th>Grade</th>
                  <th>Experience</th>
                  <th>Matched Skills</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c._id}>
                    <td>
                      <span className={`rank-badge ${getRankClass(c.rank)}`}>
                        {c.rank === 1 ? '🥇' : c.rank === 2 ? '🥈' : c.rank === 3 ? '🥉' : `#${c.rank}`}
                      </span>
                    </td>
                    <td>
                      <div className="candidate-name">{c.name}</div>
                      <div className="candidate-email">{c.email || '—'}</div>
                    </td>
                    <td>
                      <div className="score-pill">
                        <strong>{c.final_score}</strong>
                        <div className="score-mini-bar">
                          <div className="score-mini-fill" style={{ width: `${c.final_score}%` }} />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`grade-badge ${getGradeClass(c.grade)}`}>{c.grade || '—'}</span>
                    </td>
                    <td>
                      {c.experience_years != null
                        ? `${c.experience_years} yr${c.experience_years !== 1 ? 's' : ''}`
                        : '—'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {c.matched_skills?.slice(0, 3).map(s => (
                          <span key={s} className="skill-tag" style={{ fontSize: '0.7rem', padding: '3px 8px' }}>{s}</span>
                        ))}
                        {c.matched_skills?.length > 3 && (
                          <span className="skill-tag-more">+{c.matched_skills.length - 3}</span>
                        )}
                        {(!c.matched_skills || c.matched_skills.length === 0) && (
                          <span style={{ color: 'var(--gray-400)', fontSize: '0.8rem' }}>—</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${c.recommendation === 'Selected' ? 'selected' : 'rejected'}`}>
                        {c.recommendation === 'Selected' ? '✅' : '❌'} {c.recommendation}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => setSelected(c)}
                          title="View full report"
                        >
                          👁 View
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteCandidate(c._id, c.name)}
                          title="Remove candidate"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {loaded && total > 0 && filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p>No candidates match your search or filter.</p>
          </div>
        )}
      </div>
    </>
  );
}
