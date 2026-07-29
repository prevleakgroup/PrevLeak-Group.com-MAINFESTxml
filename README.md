# PrevLeak Group

This repository contains a small multi-app web project for the PrevLeak Group brand.

## Apps

- `apps/admin` – admin-facing Vite app
- `apps/landing` – marketing landing Vite app

## Development

Install dependencies and run the workspace build:

```bash
npm ci
npm run build
```

Run a development server for an app:

```bash
npm run dev --workspace=apps/admin
npm run dev --workspace=apps/landing
```

## Deployment

The project is configured for Firebase Hosting with two targets:

- `admin-panel` → `apps/admin/dist`
- `marketing-landing` → `apps/landing/dist`

The deployment workflow is defined in `.github/workflows/jekyll-gh-pages.yml`.
