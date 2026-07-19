# Guide de tests OCR

```bash
npm run test          # unitaires Vitest
npm run test:e2e      # Playwright (protection routes)
npm run typecheck
npm run lint
npm run build
```

Fixtures synthétiques : `tests/fixtures/ocr/` (aucune donnée personnelle réelle).

Worker local : `npm run ocr:worker` (nécessite `SUPABASE_SERVICE_ROLE_KEY`).
