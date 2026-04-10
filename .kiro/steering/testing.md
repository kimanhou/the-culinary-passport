---
inclusion: auto
---

# Testing

All unit tests must be run inside Docker to ensure a consistent environment matching the project's node:16.20.0 base image.

```bash
docker build -t culinary-passport .
docker run --rm culinary-passport npx react-scripts test --watchAll=false
```

Do not run `npm test` directly on the host machine.

# Local Development

To launch the UI locally via Docker:

```bash
docker-compose up --build
```

The app will be available at http://localhost:3000.

# Deploying the Cloudflare Worker

The worker Docker image is for local development only. To deploy to Cloudflare, run wrangler from the worker directory on the host:

```bash
cd worker
npx wrangler login    # first time only
npx wrangler deploy
```

Secrets (like `MISTRAL_API_KEY`) are managed via `npx wrangler secret put <NAME>` and are not stored in code.
