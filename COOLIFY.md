# Convivae Foglamp deployment

Use branch `deploy/coolify` with Coolify's Docker Compose build strategy,
Compose path `/docker-compose.yml`, and Raw Compose disabled.

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

NEXT_PUBLIC_* values must be available during the web image build. Rebuild
when they change. Email and Google OAuth credentials are optional.

Keep pg_data, ch_data, and redis_data persistent. Do not expose database ports.
The development override was renamed to docker-compose.dev.yml so Compose
cannot automatically merge its public database port mappings.

The migrate service must exit successfully before the app starts. Its first
bootstrap logs contain the initial project API key; keep them private.
Validate login and one test trace before considering deployment complete.
