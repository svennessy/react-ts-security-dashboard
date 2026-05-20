import type { Finding } from '../types/finding';
import { SLA_TARGETS_DAYS } from '../utils/sla';
import { TEAM_LABELS } from '../data/mockFindings';
import { formatSlaLabel, getSlaStatus } from '../utils/sla';
import { SeverityBadge } from './SeverityBadge';

interface Props {
  findings: Finding[];
}

export function SLAPanel({ findings }: Props) {
  const active = findings.filter(
    (f) => f.status === 'open' || f.status === 'in_progress',
  );

  const breached = active
    .filter((f) => getSlaStatus(f) === 'breached')
    .sort(
      (a, b) =>
        new Date(a.slaDueAt).getTime() - new Date(b.slaDueAt).getTime(),
    );

  const atRisk = active
    .filter((f) => getSlaStatus(f) === 'at_risk')
    .sort(
      (a, b) =>
        new Date(a.slaDueAt).getTime() - new Date(b.slaDueAt).getTime(),
    );

  const compliance =
    active.length === 0
      ? 100
      : Math.round(
          ((active.length - breached.length) / active.length) * 100,
        );

  return (
    <section className="sla-panel">
      <header className="section-header">
        <h2>SLA tracking</h2>
        <p className="section-header__sub">
          Remediation targets by severity · {compliance}% within SLA
        </p>
      </header>

      <div className="sla-targets">
        {(['critical', 'high', 'medium', 'low'] as const).map((sev) => (
          <div key={sev} className="sla-target">
            <SeverityBadge severity={sev} />
            <span className="sla-target__days">{SLA_TARGETS_DAYS[sev]} days</span>
          </div>
        ))}
      </div>

      <div className="sla-compliance">
        <div className="sla-compliance__bar">
          <div
            className="sla-compliance__fill"
            style={{ width: `${compliance}%` }}
          />
        </div>
        <span className="sla-compliance__label">
          {active.length - breached.length} of {active.length} open findings
          meeting SLA
        </span>
      </div>

      <div className="sla-lists">
        <div className="sla-list">
          <h3 className="sla-list__title sla-list__title--breached">
            Breached ({breached.length})
          </h3>
          {breached.length === 0 ? (
            <p className="sla-list__empty">No breached SLAs</p>
          ) : (
            <ul>
              {breached.map((f) => (
                <li key={f.id} className="sla-list__item">
                  <code className="mono">{f.id}</code>
                  <span className="sla-list__finding">{f.title}</span>
                  <span className="sla-list__team">{TEAM_LABELS[f.team]}</span>
                  <span className="sla-list__due">{formatSlaLabel(f)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="sla-list">
          <h3 className="sla-list__title sla-list__title--risk">
            At risk — due within 3 days ({atRisk.length})
          </h3>
          {atRisk.length === 0 ? (
            <p className="sla-list__empty">No findings at risk</p>
          ) : (
            <ul>
              {atRisk.map((f) => (
                <li key={f.id} className="sla-list__item">
                  <code className="mono">{f.id}</code>
                  <span className="sla-list__finding">{f.title}</span>
                  <span className="sla-list__team">{TEAM_LABELS[f.team]}</span>
                  <span className="sla-list__due">{formatSlaLabel(f)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
