# Task 07 verification report

## Acceptance audit

| Criterion | Verification | Result |
|---|---|---|
| AC-01, AC-02 | HTTP integration plus both fake-provider demo scenarios | Pass |
| AC-03 | Prompt-builder subject isolation test and both demo scenarios | Pass |
| AC-04 | Prompt override unit test retains hard constraints | Pass |
| AC-05 | API duplicate UUID integration test | Pass |
| AC-06 | Provider/API failure tests and E2E safe-response assertion | Pass |
| AC-07 | Result UI renders applied rules and educational notice; demo runbook check | Pass |
| AC-08 | Hook creates a fresh UUID for each submit/regenerate; manual demo check | Pass |
| AC-09 | Contain-fit unit tests cover landscape, portrait and square insertion | Pass |
| AC-10 | Existing editor save/export pipeline supports image elements; runbook includes reopen/export check | Manual demo check required |
| AC-11 | Hook cleanup aborts request and clears timer on unmount; terminal branches do not reschedule | Code audit pass |
| AC-12 | All automated suites use fake/stub providers without credentials | Pass |

## Resilience and accessibility

- Loading and polling: async fake-provider E2E.
- Timeout: 90-second terminal state in `useAiImageJob`; retry remains available.
- Validation: frontend field error/focus and API validation integration test.
- Provider failure: fake failure E2E with secret/stack assertions.
- Image load error: visible fallback and reload action; state resets for each generated image.
- Insert failure: preview stays mounted and an `aria-live` error is shown.
- Keyboard/labels/status: native controls, associated labels, named icon buttons, polite live regions, and focus moved to the terminal status heading.
- Fixtures: deterministic SVGs for 1:1, 4:3, 16:9, and 3:4; intrinsic dimensions match provider metadata.

## Security and build notes

- `.env` is ignored; `.env.example` contains names/defaults only.
- Provider errors serialize only safe code/message fields.
- The client bundle reads only `VITE_API_URL`; server provider credentials are not referenced by frontend source.
- Real Gemini smoke test: **not verified** because no credential was used during Task 07.
- See `docs/DEMO_RUNBOOK.md` for handoff commands and manual checks.
