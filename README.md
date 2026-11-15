# Nikith Prasad — Developer Portfolio

React, Vite, and Tailwind CSS portfolio for [NikithPrasad.github.io](https://nikithprasad.github.io/), with a quiet One Piece / Grand Line visual language and six project case studies.

## Run locally

```bash
npm ci
npm run dev
```

Build the production site with `npm run build`. The GitHub Actions workflow builds the site and deploys `dist/` to GitHub Pages on pushes to `main`.

## Architecture

```mermaid
flowchart LR
  A[React portfolio] --> B[Project case studies]
  A --> C[Canvas and scroll interactions]
  B --> D[Six project demo assets]
  A --> E[Resume PDF]
  F[GitHub Actions] --> G[Vite production build]
  G --> H[GitHub Pages]
```

Project performance numbers are reproduced from the individual project READMEs and evaluation reports. Clinical model metrics are presented as research results, not medical advice.
