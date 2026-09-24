# AI image demo runbook

## Automated handoff check

Use Node.js 18 or newer. No provider credential is needed; all automated checks use the deterministic fake provider.

```powershell
cd server
npm.cmd test
npm.cmd run test:e2e

cd ../frontend
npm.cmd test
npm.cmd run typecheck
npm.cmd run build
```

The repository has no configured lint command. Do not substitute a formatter or disable TypeScript checks.

## Local demo

1. Copy `server/.env.example` to `server/.env` locally and keep `IMAGE_PROVIDER=fake`.
2. Start the server with `npm.cmd run dev` in `server/`.
3. Start the client with `npm.cmd run dev` in `frontend/`.
4. Sign in, open a project and slide, then select **Ảnh AI**.
5. Run both descriptions from `docs/features/ACCEPTANCE.md`. Confirm loading, the generated fixture, optimized prompt, applied rules, educational notice, download, regenerate, and insert.
6. Save and reopen the project, then export it and confirm the inserted image remains present and proportional.

For failure recovery, restart the server with `FAKE_IMAGE_PROVIDER_MODE=failure`; the form must remain populated and show a safe retry message. Use `async` to exercise polling/loading. Browser DevTools offline mode can verify the connection error. An invalid image URL can be used during manual inspection to verify the preview retry state.

## Optional real-provider smoke test

Only if a credential is available locally, set `IMAGE_PROVIDER=gemini` and `GEMINI_API_KEY`, restart the server, and generate one low-risk demo image. Never paste the key into source, logs, screenshots, or issue text. This smoke test is intentionally excluded from CI.
