# Remaining Tasks

## 1. Production-Grade Data Layer
- [ ] Migrate from JSON file storage to SQLite or PostgreSQL.
- [ ] Add migration/init scripts and schema versioning.
- [ ] Add backup/recovery strategy for blog runs and publish jobs.

## 2. Claude Pipeline Hardening
- [ ] Validate every model response against a strict JSON schema.
- [ ] Add robust retry/backoff per step (with step-level error messages).
- [ ] Add fallback path for partial/truncated model output.
- [ ] Add revision loop when SEO score is below threshold.

## 3. Real Publishing Integrations
- [ ] Replace mock publisher with real Dev.to API integration.
- [ ] Add Medium publishing support and token handling.
- [ ] Add publish status polling and platform-specific error details.
- [ ] Add manual URL attachment option when API publishing fails.

## 4. UI Completion (Remaining Screens)
- [ ] Implement SEO Insights page (charts, trend lines, score distribution).
- [ ] Implement Automation Rules page (default prompt/tone/workflow controls).
- [ ] Implement Settings page (API keys, defaults, profile/preferences).
- [ ] Add blog detail drawer/page with edit + save + republish actions.

## 5. UX and Quality Improvements
- [ ] Add toast notifications for success/failure actions.
- [ ] Add loading skeletons for dashboard cards and table rows.
- [ ] Add stronger mobile behavior for table/list and modal workflows.
- [ ] Add empty/error states with actionable retry buttons.

## 6. Security and Validation
- [ ] Add server-side input validation (keywords, limits, sanitization).
- [ ] Add rate limiting on generation and publish endpoints.
- [ ] Add CORS origin restrictions for deployed frontend domain.
- [ ] Add secure secrets handling for deployment environments.

## 7. Testing and Reliability
- [ ] Add backend API tests (health, create run, status, publish).
- [ ] Add frontend smoke tests for dashboard and blog list flows.
- [ ] Add end-to-end test for generate -> status -> list -> publish.
- [ ] Add deterministic seed reset script for demo runs.

## 8. Deployment and Demo Readiness
- [ ] Add final deployment config for frontend and backend.
- [ ] Add production environment examples and setup docs.
- [ ] Add one-command local startup instructions.
- [ ] Add demo script checklist for presentation flow.

## 9. Nice-to-Have (After Core Completion)
- [ ] Queue multiple generation runs and track them concurrently.
- [ ] Add run history timeline with per-step durations.
- [ ] Add export (CSV/JSON) for top-performing blog metrics.
