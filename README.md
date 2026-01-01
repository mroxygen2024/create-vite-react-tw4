# create-vite-react-tw4

An npm CLI that scaffolds a Vite + React + TypeScript app with Tailwind CSS v4, ESLint, Prettier, a clean folder layout, and a minimal landing page so you can start building immediately.

## Why this stack?

- Vite + React + TypeScript: fast dev server and typed components.
- Tailwind CSS v4: utility-first styling with a tuned theme (brand colors, container, shadows, radii).
- ESLint + Prettier: consistent code quality from day one.
- Opinionated but light structure: `src/components`, `src/styles`, and a ready-to-ship landing screen.

## Quick start

```bash
npx create-vite-react-tw4 my-app
cd my-app
npm run dev
```

## What the CLI does

- Generates a Vite React TypeScript project.
- Installs Tailwind CSS v4 and PostCSS, creates a meaningful Tailwind config, and replaces the default CSS with Tailwind directives and base styles.
- Adds a small landing page UI with cards and buttons so you can see everything working.
- Sets up ESLint + Prettier with sensible rules and scripts (`lint`, `format`, `format:check`, `typecheck`).
- Refreshes the project README with usage and scripts.

## Scaffolded project layout

- `src/components/FeatureCard.tsx` – example component for the landing grid.
- `src/App.tsx` – minimal landing page showing the stack is wired up.
- `src/index.css` – Tailwind directives plus base styles and tokens.
- `tailwind.config.js` and `postcss.config.cjs` – tuned theme and PostCSS pipeline.
- ESLint/Prettier config files and updated `package.json` scripts.

## Tailwind theme highlights

- Centered container with padded breakpoints (1120px lg, 1280px 2xl).
- Brand color scale, display/body font stacks, soft shadow, and rounded corners.
- Ready-made utility classes for buttons, badges, and cards.

## Local development (for this CLI)

```bash
git clone https://github.com/mroxygen2024/create-vite-react-tw4.git
cd create-vite-react-tw4
npm install
# Test the generator locally without publishing
node bin/index.js demo-app
# or link it
npm link
create-vite-react-tw4 another-app
```

## Publish to npm

```bash
npm login
npm publish --access public
```

## Bump versions later

- Patch: `npm version patch`
- Minor: `npm version minor`
- Major: `npm version major`
  Follow with `npm publish` to release the new version.

## Requirements

- Node.js 18+ and npm.
