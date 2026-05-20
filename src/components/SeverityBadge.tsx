import type { Severity } from '../types/finding';

const LABELS: Record<Severity, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

interface Props {
  severity: Severity;
}

export function SeverityBadge({ severity }: Props) {
  return (
    <span className={`badge badge--severity badge--${severity}`}>
      {LABELS[severity]}
    </span>
  );
}
