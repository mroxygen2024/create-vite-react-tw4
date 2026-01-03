# create-vite-react-tw4

An npm CLI that scaffolds a Vite + React + TypeScript app with Tailwind CSS v4 (via `@tailwindcss/vite`), ESLint, Prettier, a clean folder layout, and a minimal landing page so you can start building immediately.

## Why this stack?

- Vite + React + TypeScript: fast dev server and typed components.
- Tailwind CSS v4 with `@tailwindcss/vite`: simple setup (single `@import "tailwindcss";` in CSS) and zero PostCSS config.
- ESLint + Prettier: consistent code quality from day one.
- Light but clear structure: `src/components`, `src/main.tsx`, and an example landing screen that proves Tailwind works.

## Quick start (use the CLI)

```bash
npx create-vite-react-tw4 my-app
cd my-app
npm run dev
```

## What the CLI sets up

- Generates a Vite React TypeScript project.
- Installs Tailwind via `tailwindcss` + `@tailwindcss/vite` (no PostCSS files).
- Replaces `src/index.css` with only `@import "tailwindcss";`.
- Updates `tsconfig.json` and `tsconfig.app.json` with `@/*` path aliases.
- Installs `@types/node` and updates `vite.config.ts` to use the Tailwind plugin and the `@` alias.
- Adds a minimal landing page with cards to show Tailwind utilities working.
- Sets up ESLint + Prettier scripts (`lint`, `format`, `format:check`, `typecheck`) and refreshes the project README.

## Scaffolded project layout

- `src/components/FeatureCard.tsx` – small card component used on the landing grid.
- `src/App.tsx` – minimal landing page proving Tailwind works.
- `src/main.tsx` – React entry.
- `src/index.css` – only `@import "tailwindcss";` (v4 style entrypoint).
- `vite.config.ts` – Tailwind plugin + `@` alias to `./src`.
- ESLint/Prettier configs and updated `package.json` scripts.

## Tailwind setup

1. `npm install tailwindcss @tailwindcss/vite`
2. Replace `src/index.css` with:

```css
@import "tailwindcss";
```

3. `tsconfig.json`

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

4. `tsconfig.app.json`

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

5. `npm install -D @types/node`

# create-vite-react-tw4

Fast, minimal CLI that scaffolds a Vite + React + TypeScript app with Tailwind CSS v4 (via `@tailwindcss/vite`), ESLint, Prettier, path aliases, and a small landing page so you know everything works.

This project has a Code of Conduct (see CONTRIBUTING.md if added; otherwise follow standard open-source etiquette).

## Table of contents

- Installation
- Features
- Docs & Community
- Quick Start
- Philosophy
- Examples
- Contributing
- Security Issues
- Running Tests
- Maintainers
- License

## Installation

This is an npm package. You need Node.js 18+ and npm. If your project is new, run `npm init` first.

Install globally (optional):

```bash
npm install create-vite-react-tw4
```

Or run via `npx` (recommended):

```bash
npx create-vite-react-tw4 my-app
```

## Features

- Vite + React + TypeScript scaffold.
- Tailwind CSS v4 via `@tailwindcss/vite` with a one-line CSS entry (`@import "tailwindcss";`).
- Path aliases `@/*` wired in `tsconfig.json`, `tsconfig.app.json`, and `vite.config.ts`.
- ESLint + Prettier scripts: `lint`, `format`, `format:check`, `typecheck`.
- Minimal landing page proving Tailwind utilities work.

## Docs & Community

- Repo: https://github.com/mroxygen2024/create-vite-react-tw4
- Issues: use GitHub Issues for bugs/feature requests.

## Quick Start

The quickest way is with `npx`:

```bash
npx create-vite-react-tw4 my-app
cd my-app
npm run dev
```

What gets generated (high level):

```text
src/
  App.tsx           # Landing page showing Tailwind works
  components/       # Example FeatureCard component
  index.css         # Only: @import "tailwindcss";
  main.tsx          # React entry
tsconfig.json       # references + @/* alias
tsconfig.app.json   # @/* alias
vite.config.ts      # Tailwind plugin + alias
```

## Philosophy

Keep it fast, minimal, and practical: sensible defaults, no heavy opinions, and clear scripts so you can start coding immediately.

## Examples

After generation, your entry looks like:

```ts
import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## Contributing

PRs and issues are welcome. Please keep changes small and documented. Follow the Code of Conduct.

## Security Issues

Please open a private security advisory on GitHub if you find a vulnerability.

## Running Tests

This CLI does not ship automated tests yet. For manual verification:

```bash
node bin/index.js demo-app
cd demo-app
npm run dev
```

## Maintainers

- Fuad Sano

## License

MIT
