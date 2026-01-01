// const fs = require('fs');
// const path = require('path');
// const { spawnSync } = require('child_process');
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const log = (message) => console.log(`\n▸ ${message}`);

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function runCommand(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: false,
    ...options,
  });

  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(' ')}`);
  }
}

function ensureTarget(appPath) {
  if (fs.existsSync(appPath) && fs.readdirSync(appPath).length > 0) {
    throw new Error(`Target directory already exists and is not empty: ${appPath}`);
  }
}

function writeFile(appPath, relativePath, content) {
  const target = path.join(appPath, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, 'utf8');
}

function createViteReactTs(appPath, appName) {
  log(`Creating Vite + React + TypeScript app in ${appPath}`);
  runCommand(npmCommand, ['create', 'vite@latest', appName, '--', '--template', 'react-ts']);
  log('Installing base dependencies');
  runCommand(npmCommand, ['install'], { cwd: appPath });
}

function installStylingAndLinting(appPath) {
  log('Adding Tailwind CSS v4 and tooling');
  runCommand(npmCommand, ['install', '-D', 'tailwindcss@next', 'postcss', 'autoprefixer'], {
    cwd: appPath,
  });

  log('Adding ESLint + Prettier');
  runCommand(
    npmCommand,
    [
      'install',
      '-D',
      'eslint',
      'eslint-config-prettier',
      'eslint-plugin-react',
      'eslint-plugin-react-hooks',
      '@typescript-eslint/parser',
      '@typescript-eslint/eslint-plugin',
      'prettier',
    ],
    { cwd: appPath }
  );
}

function configureTailwind(appPath) {
  log('Configuring Tailwind CSS and PostCSS');
  writeFile(
    appPath,
    'tailwind.config.js',
    `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        lg: '1120px',
        '2xl': '1280px',
      },
    },
    extend: {
      fontFamily: {
        display: ['"Inter Tight"', 'Inter', 'ui-sans-serif', 'system-ui'],
        body: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        brand: {
          50: '#f0f5ff',
          100: '#dfe8ff',
          200: '#b7ccff',
          300: '#8aaaff',
          400: '#5a7eff',
          500: '#365cff',
          600: '#2847d6',
          700: '#1f38aa',
          800: '#1a2f86',
          900: '#152568',
        },
      },
      boxShadow: {
        soft: '0 20px 60px rgba(22, 38, 57, 0.12)',
      },
      borderRadius: {
        xl: '1.25rem',
      },
    },
  },
  plugins: [],
};
`
  );

  writeFile(
    appPath,
    'postcss.config.cjs',
    `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`
  );

  writeFile(
    appPath,
    'src/index.css',
    `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Inter+Tight:wght@600;700&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: light;
}

body {
  @apply bg-slate-50 text-slate-900 font-body antialiased;
}

a {
  @apply text-brand-600 hover:text-brand-700 transition-colors;
}

.btn-primary {
  @apply inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-500 active:scale-[0.99];
}

.badge {
  @apply inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-100;
}

.card {
  @apply rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100;
}
`
  );
}

function scaffoldUi(appPath) {
  log('Scaffolding clean folder structure and minimal UI');
  writeFile(
    appPath,
    'src/components/FeatureCard.tsx',
    `type FeatureCardProps = {
  title: string;
  description: string;
};

export function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="card h-full">
      <div className="badge mb-3">New</div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </div>
  );
}
`
  );

  writeFile(
    appPath,
    'src/App.tsx',
    `import './index.css';
import { FeatureCard } from './components/FeatureCard';

const features = [
  {
    title: 'Type-safe by default',
    description: 'Vite + React + TypeScript with sensible linting keeps regressions in check.',
  },
  {
    title: 'Tailwind CSS v4 ready',
    description: 'A thoughtful theme, base styles, and utilities so you can ship faster.',
  },
  {
    title: 'Clean structure',
    description: 'Components, pages, and styles are separated so the project stays tidy.',
  },
];

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <header className="border-b border-slate-200 bg-white/70 backdrop-blur">
        <div className="container flex items-center justify-between py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
              <span className="text-xl font-display">VR</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">create-vite-react-tw4</p>
              <p className="text-xs text-slate-500">Starter ready to ship</p>
            </div>
          </div>
          <a className="btn-primary" href="https://vitejs.dev" target="_blank" rel="noreferrer">
            View Vite docs
          </a>
        </div>
      </header>

      <main className="container grid gap-12 py-16 lg:py-20">
        <section className="grid gap-6 text-center lg:grid-cols-[1fr,1fr] lg:items-center lg:text-left">
          <div className="space-y-6">
            <div className="badge w-fit">Everything wired up</div>
            <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
              Build fast with React, Tailwind, and TypeScript.
            </h1>
            <p className="text-lg text-slate-600">
              Start from a clean, typed, and styled foundation. Hot reloading, linting, formatting,
              and a thoughtful theme are ready so you can focus on product.
            </p>
            <div className="flex flex-wrap gap-3">
              <a className="btn-primary" href="https://tailwindcss.com" target="_blank" rel="noreferrer">
                Explore Tailwind CSS
              </a>
              <a
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"
                href="https://react.dev/learn"
                target="_blank"
                rel="noreferrer"
              >
                React docs →
              </a>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Project checklist</p>
              <span className="badge">Ready</span>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li>✔️ Vite + React + TypeScript</li>
              <li>✔️ Tailwind CSS v4 theme</li>
              <li>✔️ ESLint + Prettier</li>
              <li>✔️ Clean folder structure</li>
              <li>✔️ Minimal landing page</li>
            </ul>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} title={feature.title} description={feature.description} />
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;
`
  );

  writeFile(
    appPath,
    'src/main.tsx',
    `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`
  );
}

function addLintAndFormatConfigs(appPath) {
  log('Setting ESLint and Prettier configs');
  writeFile(
    appPath,
    '.eslintrc.cjs',
    `module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
  },
};
`
  );

  writeFile(
    appPath,
    '.eslintignore',
    `dist
node_modules
`);

  writeFile(
    appPath,
    '.prettierrc',
    JSON.stringify(
      {
        singleQuote: true,
        trailingComma: 'all',
        semi: true,
        printWidth: 100,
        tabWidth: 2,
      },
      null,
      2
    ) + '\n'
  );

  writeFile(
    appPath,
    '.prettierignore',
    `dist
node_modules
`);

  const pkgPath = path.join(appPath, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.scripts = {
    ...pkg.scripts,
    lint: 'eslint . --ext .ts,.tsx --report-unused-disable-directives --max-warnings 0',
    format: 'prettier --write .',
    'format:check': 'prettier --check .',
    typecheck: 'tsc --noEmit',
  };
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
}

function updateProjectReadme(appPath, appName) {
  log('Refreshing project README');
  writeFile(
    appPath,
    'README.md',
    `# ${appName}

A starter generated by create-vite-react-tw4.

## What's inside?
- Vite + React + TypeScript
- Tailwind CSS v4 with a custom theme
- ESLint + Prettier
- Clean folders: src/components, src/styles
- Minimal landing page UI

## Available scripts
- dev: Start the dev server
- build: Bundle for production
- preview: Preview the production build
- lint: Run ESLint
- format: Format with Prettier
- typecheck: Type-check the project

## Development
1. npm install
2. npm run dev

## Linting and formatting
- npm run lint
- npm run format
- npm run format:check

## Deploy
Build with npm run build then deploy dist/ with your preferred host.
`
  );
}

function printNextSteps(appName) {
  console.log('\nAll set!');
  console.log(`\nNext steps:\n  cd ${appName}\n  npm run dev\n`);
  console.log('Useful scripts:');
  console.log('  npm run lint         # ESLint');
  console.log('  npm run format       # Prettier write');
  console.log('  npm run format:check # Prettier check');
  console.log('  npm run typecheck    # TS type checking');
  console.log('\nHappy building!');
}

async function main() {
  const appName = process.argv[2];

  if (!appName || ['-h', '--help'].includes(appName)) {
    console.log('Usage: npx create-vite-react-tw4 <app-name>');
    console.log('Example: npx create-vite-react-tw4 my-app');
    return;
  }

  const appPath = path.resolve(process.cwd(), appName);
  ensureTarget(appPath);
  createViteReactTs(appPath, appName);
  installStylingAndLinting(appPath);
  configureTailwind(appPath);
  scaffoldUi(appPath);
  addLintAndFormatConfigs(appPath);
  updateProjectReadme(appPath, appName);
  printNextSteps(appName);
}

module.exports = { main };
