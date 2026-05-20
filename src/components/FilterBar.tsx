import type {
  EngineeringTeam,
  FindingStatus,
  Severity,
} from '../types/finding';
import { TEAM_LABELS } from '../data/mockFindings';

export interface Filters {
  search: string;
  severity: Severity | 'all';
  status: FindingStatus | 'all';
  team: EngineeringTeam | 'all';
  sla: 'all' | 'breached' | 'at_risk' | 'on_track';
}

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function FilterBar({ filters, onChange }: Props) {
  const update = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="filter-bar">
      <input
        type="search"
        className="filter-bar__search"
        placeholder="Search ID, title, asset, CVE..."
        value={filters.search}
        onChange={(e) => update('search', e.target.value)}
        aria-label="Search findings"
      />
      <select
        value={filters.severity}
        onChange={(e) =>
          update('severity', e.target.value as Filters['severity'])
        }
        aria-label="Filter by severity"
      >
        <option value="all">All severities</option>
        <option value="critical">Critical</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <select
        value={filters.status}
        onChange={(e) => update('status', e.target.value as Filters['status'])}
        aria-label="Filter by status"
      >
        <option value="all">All statuses</option>
        <option value="open">Open</option>
        <option value="in_progress">In progress</option>
        <option value="resolved">Resolved</option>
        <option value="accepted_risk">Accepted risk</option>
      </select>
      <select
        value={filters.team}
        onChange={(e) => update('team', e.target.value as Filters['team'])}
        aria-label="Filter by team"
      >
        <option value="all">All teams</option>
        {(Object.entries(TEAM_LABELS) as [EngineeringTeam, string][]).map(
          ([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ),
        )}
      </select>
      <select
        value={filters.sla}
        onChange={(e) => update('sla', e.target.value as Filters['sla'])}
        aria-label="Filter by SLA"
      >
        <option value="all">All SLA states</option>
        <option value="breached">Breached</option>
        <option value="at_risk">At risk</option>
        <option value="on_track">On track</option>
      </select>
    </div>
  );
}
