# Jobs asynchrones — Plateforme-AFD

Tables : `background_jobs`, `background_job_attempts`, `background_job_events`.

Service : `src/features/jobs/services/jobs.service.ts`

UI exports : `/admin/exports` enqueue `export.generate`.

Interdit : `setTimeout` post-HTTP pour traitements lourds.

