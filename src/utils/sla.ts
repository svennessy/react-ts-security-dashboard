import type { Finding, SLAStatus } from '../types/finding';

const MS_PER_DAY = 86_400_000;

export function getSlaStatus(finding: Finding, now = Date.now()): SLAStatus {
  if (finding.status === 'resolved' || finding.status === 'accepted_risk') {
    return 'resolved';
  }

  const due = new Date(finding.slaDueAt).getTime();
  const daysLeft = (due - now) / MS_PER_DAY;

  if (daysLeft < 0) return 'breached';
  if (daysLeft <= 3) return 'at_risk';
  return 'on_track';
}

export function daysUntilSla(finding: Finding, now = Date.now()): number {
  const due = new Date(finding.slaDueAt).getTime();
  return Math.ceil((due - now) / MS_PER_DAY);
}

export function formatSlaLabel(finding: Finding, now = Date.now()): string {
  const status = getSlaStatus(finding, now);
  if (status === 'resolved') return 'Closed';
  const days = daysUntilSla(finding, now);
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return 'Due today';
  return `${days}d left`;
}

export const SLA_TARGETS_DAYS: Record<string, number> = {
  critical: 7,
  high: 14,
  medium: 30,
  low: 90,
};
