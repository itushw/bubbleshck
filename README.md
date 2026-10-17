# BUBBLES

A synthetic flood-response coordination simulator built with React, Vite and Express. All exercise locations, resources and requests are fictional.

## Run locally

Use Node.js 22.12 or newer and Python 3 for the repository scan.

```sh
npm install
cp .env.example .env.local
npm run dev
```

Edit `.env.local` on your own machine. It is excluded from Git. The server loads it before `.env`; deployment environment variables take precedence. Never paste credentials into source files or commit a populated environment file.

- `GEMINI_API_KEY`: optional, **server-only**. Configure it in the deployment's secret/environment settings. Without it the app uses its existing exercise response fallback. Never rename this to a `VITE_` variable.
- `VITE_GOOGLE_MAPS_API_KEY`: optional, **public browser configuration**. Vite embeds this value into browser JavaScript at build time. Use a separate Maps key restricted to your exact website referrers and Maps JavaScript API. Without it, the GIS panel shows a configuration message. A key entered in the GIS dialog lasts for the current component session and is not saved to local storage.
- `APP_URL`: public deployment URL, if needed.

Build after changing any `VITE_` variable. The Express `/api/chat` endpoint needs a server deployment; publishing `dist/` alone serves only the frontend. Never share the Gemini key with the browser to work around a missing backend.

## Prepare a public repository

```sh
python3 scripts/check-secrets.py
npm run lint
npm run build
```

Before the first commit, review the staged file list and patch with `git diff --cached --name-only` and `git diff --cached`. `.gitignore` excludes environment files, tooling caches, deployment metadata, private-key files and local screenshots. Publish source code, not the entire folder as an unreviewed archive.

The scanner checks common credential patterns without printing values. It is an additional check, not a guarantee: review screenshots, custom credential formats and all staged changes yourself. If copying this project into an existing repository, scan that repository's history as well. Ignoring a file does not remove it from previous commits.

See [SECURITY.md](SECURITY.md) for the exposed-key recovery steps and deployment limitations.
