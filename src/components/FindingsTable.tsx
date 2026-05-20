import { TEAM_LABELS } from '../data/mockFindings';
import type { Finding } from '../types/finding';
import { formatSlaLabel, getSlaStatus } from '../utils/sla';
import { SeverityBadge } from './SeverityBadge';
import { SLAStatusBadge } from './SLAStatusBadge';

const STATUS_LABELS: Record<Finding['status'], string> = {
  open: 'Open',
  in_progress: 'In progress',
  resolved: 'Resolved',
  accepted_risk: 'Accepted risk',
};

interface Props {
  findings: Finding[];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function ownerName(email: string): string {
  const local = email.split('@')[0] ?? email;
  return local
    .split('.')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
}

export function FindingsTable({ findings }: Props) {
  if (findings.length === 0) {
    return (
      <div className="panel panel--empty">
        <p>No findings match the current filters.</p>
      </div>
    );
  }

  return (
    <div className="panel findings-table-wrap">
      <table className="findings-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Finding</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Team</th>
            <th>Owner</th>
            <th>SLA</th>
            <th>Due</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {findings.map((f) => {
            const slaStatus = getSlaStatus(f);
            const rowClass =
              slaStatus === 'breached' ? 'findings-table__row--breached' : '';

            return (
              <tr key={f.id} className={rowClass}>
                <td>
                  <code className="mono">{f.id}</code>
                </td>
                <td className="findings-table__title-cell">
                  <span className="findings-table__title">{f.title}</span>
                  <span className="findings-table__meta">
                    {f.asset}
                    {f.cve ? ` · ${f.cve}` : ''}
                  </span>
                </td>
                <td>
                  <SeverityBadge severity={f.severity} />
                </td>
                <td>
                  <span className={`status-pill status-pill--${f.status}`}>
                    {STATUS_LABELS[f.status]}
                  </span>
                </td>
                <td>{TEAM_LABELS[f.team]}</td>
                <td>
                  <span className="owner-cell">
                    <span className="owner-cell__name">{ownerName(f.owner)}</span>
                    <span className="owner-cell__email">{f.owner}</span>
                  </span>
                </td>
                <td>
                  <SLAStatusBadge
                    status={slaStatus}
                    label={formatSlaLabel(f)}
                  />
                </td>
                <td className="mono">{formatDate(f.slaDueAt)}</td>
                <td>
                  <span className="source-tag">{f.source}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
