# Security Findings Dashboard

React + TypeScript dashboard for engineering teams to track security findings, SLA compliance, and ownership in one place.

## Features

- **Findings registry** — Searchable, filterable table of vulnerabilities across SAST, DAST, SCA, CSPM, and pen test sources
- **SLA tracking** — Severity-based remediation targets, compliance bar, breached and at-risk queues
- **Team ownership** — Per-team open counts, critical findings, SLA health, and engineering leads

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Scripts

| Command        | Description          |
| -------------- | -------------------- |
| `npm run dev`  | Start dev server     |
| `npm run build`| Production build     |
| `npm run preview` | Preview production build |

## Project structure

```
src/
  components/   UI (Dashboard, FindingsTable, SLAPanel, TeamOwnership)
  data/         Mock findings and team summaries
  types/        TypeScript models
  utils/        SLA calculation helpers
```

Replace `src/data/mockFindings.ts` with API calls to your scanner (Snyk, Wiz, GitHub Advanced Security, etc.) when integrating with production data.

## SLA policy (default)

| Severity | Target |
| -------- | ------ |
| Critical | 7 days |
| High     | 14 days |
| Medium   | 30 days |
| Low      | 90 days |

At-risk findings are those due within 3 days.
