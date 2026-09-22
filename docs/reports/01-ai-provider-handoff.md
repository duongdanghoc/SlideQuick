# Task 01 — Repository mapping and handoff

## Actual repository mapping

- Frontend: `frontend/`, React 19 + TypeScript + Vite; build command is `npm run build`.
- Backend: `server/`, CommonJS JavaScript + Express 5; server tests use `npm test` (Node test runner).
- HTTP convention: `server/src/routes` → `server/src/controllers` → `server/src/services`; `/api` is mounted in `server/src/app.js`.
- Authentication: JWT middleware at `server/src/middleware/auth.js`; project routes require it except guest sharing routes. Upload is currently public.
- Database: SQLite via `better-sqlite3`; schema and inline migrations live in `server/src/config/database.js`.
- Editor types: `frontend/src/types/index.ts`; an image is a `SlideElement` with `type: 'image'` and its URL in `content`.
- Editor updates: `frontend/src/context/AppContext.tsx` manages project state; collaborative element updates are in `frontend/src/services/yjs-collab.ts`.
- Save: slide `elements` are JSON-serialized by `server/src/services/projectService.js`; Yjs also persists slide state in `server/src/services/yjs-server.js`.
- Export: `frontend/src/utils/pdfExport.ts` and `frontend/src/utils/pptxExport.ts` already handle image elements.
- Existing uploads: `POST /api/upload`, Multer storage in `server/uploads`, exposed at `/uploads`.

## Task 01 implementation

- Shared backend contract and safe errors: `server/src/features/ai-image/types.js`.
- Provider boundary and deterministic fake: `server/src/features/ai-image/providers/`.
- Local fixture: `server/src/features/ai-image/fixtures/eduart-placeholder.svg`, served at `/ai-image-fixtures/eduart-placeholder.svg`.
- Configuration: `IMAGE_PROVIDER=fake` (default); `FAKE_IMAGE_PROVIDER_MODE=success|async|failure` is available for tests/demo scenarios.
- No real adapter was added because the planning documents do not select a vendor. Unknown providers fail configuration validation. Add one adapter only after a provider/model and credential contract are selected.

## Documentation findings

The proposed architecture matches the repository's backend layering. `CODING_RULES.md` does not exist at the repository root or under `docs`; existing conventions in `server/README.md` were followed instead. No architecture assumption required correction.
