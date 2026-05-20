import type { Finding } from '../types/finding';
import { getSlaStatus } from '../utils/sla';

interface Props {
  findings: Finding[];
}

export function StatsBar({ findings }: Props) {
  const open = findings.filter(
    (f) => f.status === 'open' || f.status === 'in_progress',
  );
  const critical = open.filter((f) => f.severity === 'critical');
  const breached = open.filter((f) => getSlaStatus(f) === 'breached');
  const atRisk = open.filter((f) => getSlaStatus(f) === 'at_risk');
  const resolved = findings.filter((f) => f.status === 'resolved');

  const stats = [
    { label: 'Open findings', value: open.length, tone: 'default' as const },
    { label: 'Critical open', value: critical.length, tone: 'critical' as const },
    { label: 'SLA breached', value: breached.length, tone: 'breached' as const },
    { label: 'SLA at risk', value: atRisk.length, tone: 'warning' as const },
    { label: 'Resolved (30d)', value: resolved.length, tone: 'success' as const },
  ];

  return (
    <div className="stats-bar">
      {stats.map((s) => (
        <div key={s.label} className={`stat-card stat-card--${s.tone}`}>
          <span className="stat-card__value">{s.value}</span>
          <span className="stat-card__label">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
