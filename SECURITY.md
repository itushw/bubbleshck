# Credentials and public-source preparation

## Cleanup performed

A Google API key was embedded in `.env.example` and twice in the Google Maps component (runtime fallback and configuration dialog). Those copies have been removed. No private `.env` file has been created or copied with that value.

The Maps component now reads only the configured public browser key or an in-memory session override. It removes the old local-storage key on mount. The Gemini credential stays on the Express server; provider exception details are no longer returned to the browser or logged by the app.

This supplied folder did not contain a `.git` directory when inspected, so there was no local Git history to clean. Any repository or deployed build made elsewhere may still contain the old key.

## Required owner action before publishing

1. In the Google Cloud project that owns the exposed key, review its API usage and restrictions. Replace the exposed key, update applications that use it, then disable/delete the old credential. Removing it from source does not revoke it.
2. Create a separate Maps browser key. Set application restrictions to **Websites**, allow only your deployment and necessary local development origins, and restrict APIs to **Maps JavaScript API**. Avoid broad wildcard origins.
3. Keep the Gemini key separate and server-only, in deployment environment settings or ignored `.env.local`. Do not put it in `VITE_` variables. Review quotas and monitor usage.
4. Redeploy to replace the old frontend bundle. Source cleanup does not modify the existing hosted website. Old downloaded bundles or copies may persist, which is why credential replacement matters.
5. Run `python3 scripts/check-secrets.py` and inspect the files staged for your first public commit.

Maps JavaScript keys are sent to visitors by design. An environment variable prevents accidental source commits but does not make a browser key secret. Protect it with application and API restrictions.

References: [Google Maps API security guidance](https://developers.google.com/maps/api-security-best-practices), [Vite environment variables](https://vite.dev/guide/env-and-mode).

## Prototype boundaries

The login page contains intentionally public synthetic demo profiles and sample passwords. It currently identifies a demo role in the browser and is **not production authentication**. Do not reuse those sample passwords or put protected data behind that page. The contact form's local challenge is also a demonstration, not server-verified reCAPTCHA.

The AI endpoint is publicly callable and has no authenticated quota or production abuse controls. A server-only key prevents disclosure but does not prevent others from invoking the public endpoint. Add server-side authentication/authorization where appropriate, request limits and provider quotas before exposing a paid provider at scale. This cleanup is not a production security certification.

Do not open public issues containing credentials. Report vulnerabilities privately to the repository owner.
