export type Severity = 'critical' | 'high' | 'medium' | 'low';

export type FindingStatus = 'open' | 'in_progress' | 'resolved' | 'accepted_risk';

export type SLAStatus = 'breached' | 'at_risk' | 'on_track' | 'resolved';

export type EngineeringTeam =
  | 'platform'
  | 'payments'
  | 'identity'
  | 'data'
  | 'mobile'
  | 'infra';

export interface Finding {
  id: string;
  title: string;
  source: string;
  category: string;
  severity: Severity;
  status: FindingStatus;
  team: EngineeringTeam;
  owner: string;
  discoveredAt: string;
  slaDueAt: string;
  resolvedAt?: string;
  cve?: string;
  asset: string;
}

export interface TeamSummary {
  team: EngineeringTeam;
  displayName: string;
  lead: string;
  openCount: number;
  breachedSla: number;
  atRiskSla: number;
  criticalOpen: number;
}
