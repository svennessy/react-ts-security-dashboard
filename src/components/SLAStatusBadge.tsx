import type { SLAStatus } from '../types/finding';

const LABELS: Record<SLAStatus, string> = {
  breached: 'SLA Breached',
  at_risk: 'At Risk',
  on_track: 'On Track',
  resolved: 'Closed',
};

interface Props {
  status: SLAStatus;
  label?: string;
}

export function SLAStatusBadge({ status, label }: Props) {
  return (
    <span className={`badge badge--sla badge--sla-${status}`}>
      {label ?? LABELS[status]}
    </span>
  );
}
