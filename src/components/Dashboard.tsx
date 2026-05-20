import { useMemo, useState } from 'react';
import { findings, teamSummaries } from '../data/mockFindings';
import type { Finding } from '../types/finding';
import { getSlaStatus } from '../utils/sla';
import { FilterBar, type Filters } from './FilterBar';
import { FindingsTable } from './FindingsTable';
import { SLAPanel } from './SLAPanel';
import { StatsBar } from './StatsBar';
import { TeamOwnership } from './TeamOwnership';
import './Dashboard.css';

const DEFAULT_FILTERS: Filters = {
  search: '',
  severity: 'all',
  status: 'all',
  team: 'all',
  sla: 'all',
};

function matchesFilters(finding: Finding, filters: Filters): boolean {
  if (filters.severity !== 'all' && finding.severity !== filters.severity) {
    return false;
  }
  if (filters.status !== 'all' && finding.status !== filters.status) {
    return false;
  }
  if (filters.team !== 'all' && finding.team !== filters.team) {
    return false;
  }
  if (filters.sla !== 'all') {
    const sla = getSlaStatus(finding);
    if (sla !== filters.sla) return false;
  }
  if (filters.search.trim()) {
    const q = filters.search.toLowerCase();
    const haystack = [
      finding.id,
      finding.title,
      finding.asset,
      finding.source,
      finding.owner,
      finding.cve ?? '',
    ]
      .join(' ')
      .toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  return true;
}

type Tab = 'findings' | 'sla' | 'ownership';

export function Dashboard() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [tab, setTab] = useState<Tab>('findings');

  const filtered = useMemo(
    () => findings.filter((f) => matchesFilters(f, filters)),
    [filters],
  );

  const lastUpdated = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-header__brand">
          <div className="dashboard-header__logo" aria-hidden>
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
              <path
                d="M12 2L4 6v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V6l-8-4z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M9 12l2 2 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h1>Security Findings Dashboard</h1>
            <p className="dashboard-header__tagline">
              Centralized view for engineering remediation
            </p>
          </div>
        </div>
        <div className="dashboard-header__meta">
          <span className="env-badge">Production</span>
          <time dateTime={new Date().toISOString()}>Updated {lastUpdated}</time>
        </div>
      </header>

      <StatsBar findings={findings} />

      <nav className="tab-nav" aria-label="Dashboard sections">
        <button
          type="button"
          className={tab === 'findings' ? 'tab-nav__btn tab-nav__btn--active' : 'tab-nav__btn'}
          onClick={() => setTab('findings')}
        >
          All findings
          <span className="tab-nav__count">{filtered.length}</span>
        </button>
        <button
          type="button"
          className={tab === 'sla' ? 'tab-nav__btn tab-nav__btn--active' : 'tab-nav__btn'}
          onClick={() => setTab('sla')}
        >
          SLA tracking
        </button>
        <button
          type="button"
          className={tab === 'ownership' ? 'tab-nav__btn tab-nav__btn--active' : 'tab-nav__btn'}
          onClick={() => setTab('ownership')}
        >
          Team ownership
        </button>
      </nav>

      {tab === 'findings' && (
        <section className="dashboard-section">
          <header className="section-header section-header--row">
            <div>
              <h2>Findings registry</h2>
              <p className="section-header__sub">
                {filtered.length} of {findings.length} findings
              </p>
            </div>
          </header>
          <FilterBar filters={filters} onChange={setFilters} />
          <FindingsTable findings={filtered} />
        </section>
      )}

      {tab === 'sla' && (
        <section className="dashboard-section">
          <SLAPanel findings={findings} />
        </section>
      )}

      {tab === 'ownership' && (
        <section className="dashboard-section">
          <TeamOwnership summaries={teamSummaries} findings={findings} />
        </section>
      )}
    </div>
  );
}
