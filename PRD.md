# PRD: Lens

**Friendly Name:** Strategic Visualization Engine
**Version:** 1.0
**Status:** Approved
**Author:** Atlas Knox
**Last Updated:** 2026-03-21
**Parent Project Doc:** [Lens Project Definition](atlas-docs/Projects/Lens/Lens.md)
**Repository:** [atlas-lens](https://github.com/knox-shrugged/atlas-lens)
**Primary Initiatives:** [Panopticon](atlas-docs/Initiatives/Panopticon/Panopticon.md)
**Lead Agent:** [Argus](atlas-docs/Agents/Visualization-Argus/Argus.md)

---

## 1. Executive Summary

Atlas Lens is the premier visualization platform for the Atlas Knox ecosystem. It transforms the static strategic markdown documentation of `atlas-docs` into a dynamic, interactive architectural dashboard — providing total, real-time visibility over the relationships between Goals, Initiatives, Projects, Agents, and operational Activities.

Lens is the tactical execution arm of the **Panopticon** initiative, which exists to fulfill the strategic goal of **Architectural Observability** — achieving zero-maintenance, complete transparency over the Atlas data structures and architecture as the ecosystem scales in complexity. Without Lens, the strategic hierarchy exists only as a collection of loosely-linked markdown files. With Lens, it becomes a living, navigable map of intent and execution.

The application follows a two-stage pipeline architecture: a Node.js ingestion parser reads the sibling `atlas-docs` repository and produces structured JSON, which a React + TypeScript frontend then renders as an interactive force-directed graph, tabular views, calendar displays, and hierarchical task trees.

---

## 2. Problem Statement

### 2.1 Current State
The Atlas ecosystem's strategic documentation resides in `atlas-docs` as a collection of interlinked markdown files organized into categorical directories (Goals, Initiatives, Projects, Agents, Activities, Learnings). While structurally sound, these files are navigated through raw text and manual link-following, which does not scale as the ecosystem grows.

### 2.2 Desired Future State
A premium, interactive web dashboard that:
- Automatically parses all `atlas-docs` content into a unified visual graph.
- Renders the full strategic hierarchy (Goals → Initiatives → Projects → Agents) as an interactive, explorable network.
- Provides specialized views for Learnings, Jobs, and Tasks.
- Updates in near-real-time as documentation changes, requiring zero manual maintenance.

### 2.3 Impact of Inaction
Without architectural transparency, the ecosystem risks:
- **Strategic drift** — disconnects between stated goals and active projects become invisible.
- **Orphaned entities** — agents, tasks, or projects that lose their strategic linkage go undetected.
- **Cognitive overload** — as complexity grows, manually tracking relationships across dozens of markdown files becomes untenable.

---

## 3. Goals & Success Criteria

### 3.1 Primary Goals
- [ ] Deliver a fully functional interactive graph visualization of the complete `atlas-docs` hierarchy.
- [ ] Provide four specialized views: Vision (graph), Learnings (table), Jobs (calendar), Tasks (tree-grid).
- [ ] Achieve automated, one-command ingestion from `atlas-docs` to visual output.
- [ ] Maintain visual accuracy — the Lens visualization must always match the current state of `atlas-docs`.

### 3.2 Non-Goals (Explicit Exclusions)
- Lens does **not** author or modify documentation — it is strictly a read-only consumer.
- Lens does **not** provide real-time collaboration or multi-user editing.
- Lens does **not** integrate with external APIs or data sources — it reads only from `atlas-docs`.
- Lens does **not** include authentication or access control — it is a local development tool.

### 3.3 Key Performance Indicators (KPIs)
| KPI | Target | Measurement Method |
|-----|--------|--------------------|
| Visual Accuracy | 100% of `atlas-docs` entities rendered correctly | Manual comparison after each ingestion |
| Relational Integrity | All cross-document links represented as graph edges | Automated edge count vs. markdown link count |
| Ingestion Latency | < 3 seconds for full parse | Console timing output from `parse-docs.js` |
| Page Load | < 2 seconds on localhost | Browser dev tools performance audit |

---

## 4. Functional Requirements

### 4.1 Core Features

#### Feature 1: Vision — Strategic Graph Visualization
- **Description:** An interactive, force-directed nodal graph that maps the full ecosystem hierarchy across four primary layers: Goals, Initiatives, Projects, and Agents.
- **User Interaction:** Pan, zoom, click to select nodes. Nodes support expansion and collapse for managing complex sub-structures.
- **Acceptance Criteria:**
  - [ ] Many-to-many relationships rendered accurately between all layers.
  - [ ] Agent nodes display a concise role summary directly on the node.
  - [ ] Interactive legend in the bottom-right identifying node types and status symbols.
  - [ ] Collapsible hierarchy — nodes expand/collapse to manage descendant branches.
  - [ ] Clear, intuitive status indicator icons on all nodes.

#### Feature 2: Learnings — Institutional Knowledge Table
- **Description:** A structured data table aggregating all entries from the `atlas-docs/Learnings/` directory.
- **User Interaction:** Scrollable table view with sortable columns.
- **Acceptance Criteria:**
  - [ ] All Learnings documents rendered in a clean tabular format.
  - [ ] Title, description, and metadata fields displayed per row.

#### Feature 3: Jobs — Recurring Operations Calendar
- **Description:** A 7-day calendar view displaying recurring ecosystem operations (cron jobs), aligned to their parent projects.
- **User Interaction:** Weekly calendar with day-columns showing scheduled jobs.
- **Acceptance Criteria:**
  - [ ] Jobs displayed on their scheduled day(s) with project attribution.
  - [ ] Schedule metadata (`**Schedule:**` field) parsed and rendered correctly.

#### Feature 4: Tasks — Hierarchical Task Tracker
- **Description:** A premium tree-grid interface supporting recursive expansion/collapse of task hierarchies.
- **User Interaction:** Expandable/collapsible rows, each displaying parent project and assigned agent.
- **Acceptance Criteria:**
  - [ ] Recursive sub-task expansion supported.
  - [ ] Each task displays its parent project and assigned agent.
  - [ ] Status indicators visible per task.

### 4.2 Data Requirements

| Data Entity | Source | Format | Cadence |
|-------------|--------|--------|---------|
| Strategic Entities (Goals, Initiatives, Projects, Agents) | `atlas-docs/` | Markdown → JSON | On-demand via `npm run ingest` |
| Learnings | `atlas-docs/Learnings/` | Markdown → JSON | On-demand via `npm run ingest` |
| Activities (Jobs, Tasks) | `atlas-docs/Activities/` | Markdown → JSON | On-demand via `npm run ingest` |

### 4.3 Integration Points

| System | Direction | Protocol | Purpose |
|--------|-----------|----------|---------|
| `atlas-docs` | Inbound | File I/O (Node.js `fs`) | Source of all strategic documentation |
| `graph_data.json` | Internal | Static JSON fetch | Bridge between parser and frontend |

---

## 5. Technical Requirements

### 5.1 Technology Stack

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| Runtime | Node.js | 20.x+ LTS | Required for ingestion parser and Vite tooling |
| Bundler | Vite | 8.0.1 | Fast HMR, modern ESM-first build pipeline |
| Framework | React | 19.2.4 | Component-based UI with hooks |
| Language | TypeScript | 5.9.3 | Type safety across all frontend components |
| Visualization | @xyflow/react (React Flow) | 12.10.1 | Interactive node graph rendering with pan/zoom |
| Markdown Parsing | marked + gray-matter | marked 17.0.5 / gray-matter 4.0.3 | Extract frontmatter and resolve markdown links |
| Styling | Vanilla CSS | N/A | Maximum flexibility, no framework overhead |

### 5.2 Architecture Overview

```
atlas-docs/                          atlas-lens/
┌──────────────────────┐             ┌──────────────────────────────────┐
│  Goals/              │             │  scripts/                        │
│  Initiatives/        │──[fs read]──│    parse-docs.js (Ingestion)     │
│  Projects/           │             │         │                        │
│  Agents/             │             │         ▼                        │
│  Activities/         │             │  public/                         │
│  Learnings/          │             │    graph_data.json               │
└──────────────────────┘             │         │                        │
                                     │         ▼                        │
                                     │  src/                            │
                                     │    App.tsx (Router/Layout)       │
                                     │    GraphViewer.tsx (Vision)      │
                                     │    TableView.tsx (Learnings)     │
                                     │    CalendarView.tsx (Jobs)       │
                                     │    TasksView.tsx (Tasks)         │
                                     └──────────────────────────────────┘
```

**Data flows strictly one-way:** `atlas-docs` → `parse-docs.js` → `graph_data.json` → React Frontend.

### 5.3 Directory Structure

```
atlas-lens/
├── .agents/
│   ├── rules/
│   │   ├── argus-identity.md       # Agent persona definition
│   │   └── lens-operations.md      # Operational engineering blueprint
│   └── workflows/
│       ├── run-lens.md             # Dev server startup workflow
│       └── ingest-docs.md          # Documentation ingestion workflow
├── scripts/
│   └── parse-docs.js               # Node.js ingestion parser
├── src/
│   ├── App.tsx                      # Root component with navigation
│   ├── GraphViewer.tsx              # React Flow graph visualization
│   ├── TableView.tsx                # Learnings table view
│   ├── CalendarView.tsx             # Jobs calendar view
│   ├── TasksView.tsx                # Tasks tree-grid view
│   ├── App.css                      # Component styles
│   ├── index.css                    # Global styles
│   └── main.tsx                     # Application entry point
├── public/
│   └── graph_data.json              # Ingested data (generated, not hand-authored)
├── index.html                       # Vite HTML entry
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── eslint.config.js
├── PRD.md                           # This document
└── README.md
```

### 5.4 Performance Requirements

| Metric | Requirement | Notes |
|--------|------------|-------|
| Ingestion Time | < 3 seconds | Full parse of `atlas-docs` into `graph_data.json` |
| Dev Server Startup | < 500ms | Vite cold start |
| Initial Page Load | < 2 seconds | Time to interactive on localhost |
| Graph Render | < 1 second | Time to render full node graph after data load |
| Smooth Interaction | 60 FPS | Pan, zoom, and hover animations must remain fluid |

### 5.5 Security & Credential Governance

- Atlas Lens requires **zero credentials** — it reads only from the local filesystem.
- No API keys, tokens, or secrets are needed.
- The application runs exclusively on localhost and is not deployed to any remote environment.
- `graph_data.json` contains no sensitive information — only structural metadata derived from public documentation.

### 5.6 Error Handling & Resilience

| Failure Scenario | Expected Behavior |
|------------------|-------------------|
| `atlas-docs` directory not found | Parser logs clear error message with expected path, exits gracefully |
| Malformed markdown file | Parser skips file, logs warning, continues ingestion |
| `graph_data.json` missing or empty | Frontend displays empty state with instructional message to run ingestion |
| Invalid markdown link target | Edge is not created, no crash — parser continues silently |

---

## 6. User Experience & Interface Requirements

### 6.1 UI/UX Guidelines
- **Theme:** Sophisticated dark-mode experience with deep background (`#0D1117`).
- **Effects:** Glassmorphism on header and panels, glowing interactive nodes, subtle micro-animations on hover.
- **Typography:** System font stack with tight letter-spacing and gradient text effects for branding.
- **Color Palette:**
  - Background: `#0D1117`
  - Surface/Borders: `#30363d`
  - Primary Accent: `#3b82f6` (Blue) with glow effects (`box-shadow: 0 0 15px rgba(59, 130, 246, 0.4)`)
  - Secondary Accent: `#6366f1` (Indigo) for gradient elements
  - Text Primary: `#f3f4f6`
  - Text Secondary: `#8b949e`
  - Node Colors: Differentiated by category (Goals = Blue, Initiatives = Purple, Projects = Green, Agents = Orange)

### 6.2 Views & Navigation

| View | Purpose | Key Elements |
|------|---------|--------------|
| **Vision** | Interactive strategic graph | React Flow canvas, node legend, zoom/pan controls |
| **Learnings** | Institutional knowledge table | Sortable table rows, metadata columns |
| **Jobs** | Recurring operations calendar | 7-day weekly grid, job cards with project attribution |
| **Tasks** | Hierarchical task management | Expandable tree-grid, agent/project columns, status badges |

### 6.3 Responsiveness
- Primary target: Desktop browsers (1280px+ viewport).
- The application is a local development tool; mobile responsiveness is not a priority but the layout should not break below 1024px.

---

## 7. Deployment & Operations

### 7.1 Prerequisites
- [ ] Node.js >= 20.x LTS installed
- [ ] `atlas-docs` repository cloned as a sibling directory (`../atlas-docs`)
- [ ] `npm install` completed successfully in `atlas-lens/`

### 7.2 Build & Run Instructions

#### Local Development
```bash
# Navigate to the project directory
cd atlas-lens

# Install dependencies
npm install

# Run the documentation ingestion parser
npm run ingest

# Start the Vite development server
npm run dev

# Application available at http://localhost:5173/
```

#### Production Build
```bash
# Type-check and build for production
npm run build

# Preview the production build locally
npm run preview
```

#### Linting
```bash
npm run lint
```

### 7.3 Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| N/A | — | Atlas Lens requires no environment variables | — |

### 7.4 Deployment Target

| Aspect | Detail |
|--------|--------|
| **Hosting** | Local only (localhost) |
| **Trigger Model** | Manual — developer starts dev server on demand |
| **CI/CD** | None — local development tool |
| **Domain** | `http://localhost:5173/` (default Vite port) |

### 7.5 Monitoring & Observability
- **Logging:** Console output from `parse-docs.js` reports node/edge counts after each ingestion.
- **Alerts:** None — local tool with no remote monitoring.
- **Health Check:** Visual verification by refreshing the Lens browser page after ingestion.

---

## 8. Milestones & Phasing

| Phase | Milestone | Description | Target Date | Status |
|-------|-----------|-------------|-------------|--------|
| 1 | MVP Graph | Basic ingestion parser + interactive graph with Goals, Initiatives, Projects | — | Complete |
| 2 | Agent Integration | Agent nodes with role summaries rendered on graph | — | Complete |
| 3 | Multi-View Dashboard | Learnings table, Jobs calendar, Tasks tree-grid views | — | Complete |
| 4 | Collapsible Hierarchies | Node expansion/collapse for managing complex sub-structures | — | In Progress |
| 5 | Real-Time Sync | File-watcher integration for automatic re-ingestion on `atlas-docs` changes | [TBD] | Planned |
| 6 | Search & Filter | Full-text search and category filtering across all views | [TBD] | Planned |

---

## 9. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| `atlas-docs` schema changes break parser | Medium | High | Parser uses defensive extraction with fallback defaults; template enforcement in `atlas-docs` reduces drift |
| Graph becomes unreadable at scale (50+ nodes) | Medium | Medium | Collapsible hierarchies, category-based layout, zoom/pan controls |
| Sibling directory assumption breaks in CI | Low | Medium | Parser path is configurable; document the sibling requirement clearly |
| React Flow performance degrades with large graphs | Low | Medium | Virtualization and node batching can be introduced if needed |

---

## 10. Open Questions & Decisions

| # | Question | Status | Decision | Date |
|---|----------|--------|----------|------|
| 1 | Should ingestion be triggered automatically via file-watcher? | Open | [TBD] | — |
| 2 | Should Lens be deployed to a remote host for team access? | Open | [TBD] | — |
| 3 | Should the graph support editing/creating nodes (write-back to atlas-docs)? | Resolved | No — Lens is strictly read-only per architectural boundary | 2026-03-21 |
| 4 | Should search/filter span across all views or be view-specific? | Open | [TBD] | — |

---

## 11. Appendix

### 11.1 Glossary

| Term | Definition |
|------|-----------|
| **Ingestion** | The process of parsing `atlas-docs` markdown files into structured JSON for frontend consumption |
| **Pulse** | A single execution of a data pipeline (term shared with Sonar) |
| **Vision** | The primary graph visualization view in Lens |
| **Panopticon** | The parent initiative focused on dynamic real-time mapping of Atlas strategy |
| **Argus** | The autonomous agent assigned to building and maintaining Atlas Lens |

### 11.2 References
- [Lens Project Definition](atlas-docs/Projects/Lens/Lens.md)
- [Panopticon Initiative](atlas-docs/Initiatives/Panopticon/Panopticon.md)
- [Architectural Observability Goal](atlas-docs/Goals/Architectural-Observability/Architectural-Observability.md)
- [Argus Agent Identity](atlas-lens/.agents/rules/argus-identity.md)
- [Lens Operational Blueprint](atlas-lens/.agents/rules/lens-operations.md)
- [PRD Template](atlas-docs/Templates/PRD-Template.md)
