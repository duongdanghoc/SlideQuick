# Data Model

Prototype chỉ cần hai entity. Tên cột và migration syntax phải theo ORM/query layer hiện có.

## `ai_image_jobs`

```text
id                 TEXT PRIMARY KEY
user_id            TEXT NULL/NOT NULL theo auth hiện có
project_id         TEXT NULL
slide_id           TEXT NULL
idempotency_key    TEXT NOT NULL
source_prompt      TEXT NOT NULL
optimized_prompt   TEXT NOT NULL
options_json       TEXT NOT NULL
applied_rules_json TEXT NOT NULL
provider           TEXT NOT NULL
model              TEXT NOT NULL
external_job_id    TEXT NULL
status             TEXT NOT NULL
error_code         TEXT NULL
created_at         TEXT NOT NULL
completed_at       TEXT NULL
```

Constraints/index:

- Unique `(user_id, idempotency_key)` nếu auth tồn tại.
- Index `status` chỉ khi worker/poller backend cần query.
- Status allowlist ở application layer hoặc CHECK constraint theo convention hiện có.

## `generated_images`

```text
id           TEXT PRIMARY KEY
job_id       TEXT NOT NULL UNIQUE
user_id      TEXT NULL/NOT NULL theo auth hiện có
storage_url  TEXT NOT NULL
storage_key  TEXT NULL
width        INTEGER NOT NULL
height       INTEGER NOT NULL
mime_type    TEXT NOT NULL
created_at   TEXT NOT NULL
```

`storage_key` được lưu khi backend sở hữu object trong Supabase/local storage để hỗ trợ cleanup; fixture hoặc URL ngoài có thể để `NULL`.

Relationship: `generated_images.job_id → ai_image_jobs.id`.

## Serialization

`options_json`:

```json
{
  "subject": "physics",
  "gradeLevel": "secondary",
  "imageType": "force_diagram",
  "style": "clean_diagram",
  "aspectRatio": "16:9"
}
```

`applied_rules_json`:

```json
[
  { "id": "physics.vector-direction", "label": "Thể hiện rõ chiều vector" }
]
```

## Lifecycle rules

- Create job trước khi gọi provider.
- Mọi state update giữ cùng `job.id`.
- Completed job có đúng một generated image trong prototype.
- Failed job không có image row.
- Không lưu image binary/base64 trong database.
- P0 không cần soft delete, favorite, feedback hoặc template table.
