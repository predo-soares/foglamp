# Convivae Foglamp deployment

Use branch `deploy/coolify` with Coolify's Docker Compose build strategy,
Compose path `/docker-compose.yml`, and Raw Compose disabled.
The Compose file contains prebuilt images only; no source builds run on the VPS.

Routes:
- `https://foglamp.convivae.com:3001` -> web
- `https://foglamp-api.convivae.com:3000` -> server
- `https://foglamp-ingest.convivae.com:4000` -> ingest

Set these variables in Coolify:

```dotenv
BETTER_AUTH_URL=https://foglamp-api.convivae.com
CORS_ORIGIN=https://foglamp.convivae.com
NEXT_PUBLIC_SERVER_URL=https://foglamp-api.convivae.com
NEXT_PUBLIC_APP_URL=https://foglamp.convivae.com
ADMIN_EMAIL=contato@convivae.com
AUTH_DISABLE_EMAIL_PASSWORD=false
```

Generate distinct secrets for POSTGRES_PASSWORD, BETTER_AUTH_SECRET,
ADMIN_PASSWORD, and FOGLAMP_SECRETS_KEY. Use at least 32 random bytes per secret;
use hexadecimal for POSTGRES_PASSWORD so it is safe inside DATABASE_URL.
Store secrets only in Coolify and a password manager.

The `Build Coolify images` GitHub Actions workflow runs on pushes to
`deploy/coolify`. It builds all four targets on standard public GitHub-hosted
runners for amd64 and arm64, then publishes multi-architecture images to GHCR.
Only public URLs are passed as build arguments. Production secrets stay in Coolify.

After the workflow succeeds:
1. Ensure the four `foglamp-*` GHCR packages are public so Coolify can pull
   them without a registry token. The source and images contain no secrets.
2. Set `FOGLAMP_IMAGE_TAG` in Coolify to the complete successful commit SHA.
3. Reload Compose from Git, verify the three domain routes, then deploy.

The workflow also publishes a convenience `coolify` tag, but production uses
an immutable commit SHA so updates happen only when that value is changed.
NEXT_PUBLIC_* values are compiled into the web image by the workflow. Update
the workflow URLs and rebuild when they change. Keep matching runtime values
in Coolify. Email and Google OAuth credentials are optional.

All containers rotate Docker logs at 10 MB per file with three files retained.
The migrate job exits once; other services restart unless explicitly stopped.

Keep pg_data, ch_data, and redis_data persistent. Do not expose database ports.
The development override was renamed to docker-compose.dev.yml so Compose
cannot automatically merge its public database port mappings.

The migrate service must exit successfully before the app starts. Its first
bootstrap logs contain the initial project API key; keep them private.
Validate login and one test trace before considering deployment complete.
