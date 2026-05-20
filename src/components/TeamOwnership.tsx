import type { Finding, TeamSummary } from '../types/finding';
import { TEAM_LABELS } from '../data/mockFindings';

interface Props {
  summaries: TeamSummary[];
  findings: Finding[];
}

export function TeamOwnership({ summaries, findings }: Props) {
  const openByTeam = summaries.map((s) => {
    const teamFindings = findings.filter(
      (f) =>
        f.team === s.team &&
        (f.status === 'open' || f.status === 'in_progress'),
    );
    const maxOpen = Math.max(...summaries.map((x) => x.openCount), 1);

    return { ...s, teamFindings, barPct: (s.openCount / maxOpen) * 100 };
  });

  return (
    <section className="ownership-panel">
      <header className="section-header">
        <h2>Engineering ownership</h2>
        <p className="section-header__sub">
          Open findings and SLA health by team
        </p>
      </header>

      <div className="team-grid">
        {openByTeam.map((team) => (
          <article key={team.team} className="team-card">
            <div className="team-card__header">
              <h3>{team.displayName}</h3>
              <span className="team-card__lead">Lead: {team.lead}</span>
            </div>

            <div className="team-card__metrics">
              <div className="team-metric">
                <span className="team-metric__value">{team.openCount}</span>
                <span className="team-metric__label">Open</span>
              </div>
              <div className="team-metric team-metric--critical">
                <span className="team-metric__value">{team.criticalOpen}</span>
                <span className="team-metric__label">Critical</span>
              </div>
              <div className="team-metric team-metric--breached">
                <span className="team-metric__value">{team.breachedSla}</span>
                <span className="team-metric__label">SLA breached</span>
              </div>
              <div className="team-metric team-metric--risk">
                <span className="team-metric__value">{team.atRiskSla}</span>
                <span className="team-metric__label">At risk</span>
              </div>
            </div>

            <div className="team-card__bar">
              <div
                className="team-card__bar-fill"
                style={{ width: `${team.barPct}%` }}
              />
            </div>

            {team.teamFindings.length > 0 && (
              <ul className="team-card__findings">
                {team.teamFindings.slice(0, 3).map((f) => (
                  <li key={f.id}>
                    <code className="mono">{f.id}</code>
                    <span>{f.title}</span>
                  </li>
                ))}
                {team.teamFindings.length > 3 && (
                  <li className="team-card__more">
                    +{team.teamFindings.length - 3} more
                  </li>
                )}
              </ul>
            )}
          </article>
        ))}
      </div>

      <div className="ownership-table-wrap panel">
        <table className="ownership-table">
          <thead>
            <tr>
              <th>Team</th>
              <th>Engineering lead</th>
              <th>Open</th>
              <th>Critical</th>
              <th>SLA breached</th>
              <th>At risk</th>
              <th>Workload</th>
            </tr>
          </thead>
          <tbody>
            {summaries.map((s) => {
              const max = Math.max(...summaries.map((x) => x.openCount), 1);
              const pct = (s.openCount / max) * 100;
              return (
                <tr key={s.team}>
                  <td>{TEAM_LABELS[s.team]}</td>
                  <td>{s.lead}</td>
                  <td>{s.openCount}</td>
                  <td className={s.criticalOpen > 0 ? 'cell--critical' : ''}>
                    {s.criticalOpen}
                  </td>
                  <td className={s.breachedSla > 0 ? 'cell--breached' : ''}>
                    {s.breachedSla}
                  </td>
                  <td className={s.atRiskSla > 0 ? 'cell--risk' : ''}>
                    {s.atRiskSla}
                  </td>
                  <td>
                    <div className="inline-bar">
                      <div
                        className="inline-bar__fill"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
