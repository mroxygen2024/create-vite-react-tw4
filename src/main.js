import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const log = (message) => console.log(`\n▸ ${message}`);
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const runCommand = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: false,
    ...options,
  });

  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(' ')}`);
  }
};

const ensureTarget = (appPath) => {
  if (fs.existsSync(appPath) && fs.readdirSync(appPath).length > 0) {
    throw new Error(`Target directory already exists and is not empty: ${appPath}`);
  }
};

const writeFile = (appPath, relativePath, content) => {
  const target = path.join(appPath, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, 'utf8');
};

const createViteReactTs = (appPath, appName) => {
  log(`Creating Vite + React + TypeScript app in ${appPath}`);
  runCommand(npmCommand, ['create', 'vite@latest', appName, '--', '--template', 'react-ts']);
  log('Installing base dependencies');
  runCommand(npmCommand, ['install'], { cwd: appPath });
};

const installStylingAndLinting = (appPath) => {
  log('Adding Tailwind CSS v4 via @tailwindcss/vite');
  runCommand(npmCommand, ['install', 'tailwindcss', '@tailwindcss/vite'], { cwd: appPath });

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
};

const updateCssForTailwind = (appPath) => {
  log('Switching index.css to Tailwind entrypoint');
  writeFile(appPath, 'src/index.css', '@import "tailwindcss";\n');
};

const mergeCompilerOptions = (compilerOptions = {}, extra = {}) => ({
  ...compilerOptions,
  ...extra,
  paths: {
    ...(compilerOptions.paths || {}),
    '@/*': ['./src/*'],
  },
});

const updateTsconfig = (appPath) => {
  log('Updating tsconfig.json and tsconfig.app.json for path aliases');
  const tsconfigPath = path.join(appPath, 'tsconfig.json');
  const appConfigPath = path.join(appPath, 'tsconfig.app.json');

  try {
    const base = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    base.files = [];
    base.references = [
      { path: './tsconfig.app.json' },
      { path: './tsconfig.node.json' },
    ];
    base.compilerOptions = mergeCompilerOptions(base.compilerOptions, { baseUrl: '.' });
    fs.writeFileSync(tsconfigPath, JSON.stringify(base, null, 2));
  } catch (error) {
    writeFile(
      appPath,
      'tsconfig.json',
      JSON.stringify(
        {
          files: [],
          references: [
            { path: './tsconfig.app.json' },
            { path: './tsconfig.node.json' },
          ],
          compilerOptions: {
            baseUrl: '.',
            paths: {
              '@/*': ['./src/*'],
            },
          },
        },
        null,
        2
      ) + '\n'
    );
  }

  try {
    const appConfig = JSON.parse(fs.readFileSync(appConfigPath, 'utf8'));
    appConfig.compilerOptions = mergeCompilerOptions(appConfig.compilerOptions, { baseUrl: '.' });
    fs.writeFileSync(appConfigPath, JSON.stringify(appConfig, null, 2));
  } catch (error) {
    writeFile(
      appPath,
      'tsconfig.app.json',
      JSON.stringify(
        {
          compilerOptions: {
            baseUrl: '.',
            paths: {
              '@/*': ['./src/*'],
            },
          },
        },
        null,
        2
      ) + '\n'
    );
  }
};

const updateViteConfig = (appPath) => {
  log('Updating vite.config.ts for Tailwind plugin and @ alias');
  writeFile(
    appPath,
    'vite.config.ts',
    `import path from "path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
`
  );
};

const installNodeTypes = (appPath) => {
  log('Installing @types/node for TS support');
  runCommand(npmCommand, ['install', '-D', '@types/node'], { cwd: appPath });
};

const scaffoldUi = (appPath) => {
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
    <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
        New
      </div>
      <h3 className="mt-3 text-lg font-semibold text-slate-900">{title}</h3>
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
    title: 'Tailwind ready',
    description: 'Tailwind v4 is wired through the Vite plugin and a single @import entry.',
  },
  {
    title: 'TypeScript paths',
    description: 'Aliases with @/* are configured in both tsconfig and Vite.',
  },
  {
    title: 'ESLint + Prettier',
    description: 'Linting and formatting scripts are set so you can stay consistent.',
  },
];

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <header className="border-b border-slate-200 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
              <span className="text-lg font-semibold">VR</span>
            </div>
            <div>
              <p className="text-sm font-semibold">create-vite-react-tw4</p>
              <p className="text-xs text-slate-500">Starter ready to ship</p>
            </div>
          </div>
          <a
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            href="https://vitejs.dev"
            target="_blank"
            rel="noreferrer"
          >
            View Vite docs
          </a>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-12 px-6 py-16 lg:py-20">
        <section className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              Everything wired up
            </div>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              Build fast with React, Tailwind, and TypeScript.
            </h1>
            <p className="text-lg text-slate-600">
              Start from a clean, typed, and styled foundation. Hot reloading, linting, formatting,
              and Tailwind v4 are ready so you can focus on product.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
                href="https://tailwindcss.com"
                target="_blank"
                rel="noreferrer"
              >
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
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Project checklist</p>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                Ready
              </span>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li>✔️ Vite + React + TypeScript</li>
              <li>✔️ Tailwind via @tailwindcss/vite</li>
              <li>✔️ ESLint + Prettier scripts</li>
              <li>✔️ Path aliases @/*</li>
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
};

const addLintAndFormatConfigs = (appPath) => {
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
};

const updateProjectReadme = (appPath, appName) => {
  log('Refreshing project README');
  writeFile(
    appPath,
    'README.md',
    `# ${appName}

A starter generated by create-vite-react-tw4.

## What's inside?
- Vite + React + TypeScript
- Tailwind CSS v4 via @tailwindcss/vite
- ESLint + Prettier
- Path aliases @/* configured for TS + Vite
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
};

const printNextSteps = (appName) => {
  console.log('\nAll set!');
  console.log(`\nNext steps:\n  cd ${appName}\n  npm run dev\n`);
  console.log('Useful scripts:');
  console.log('  npm run lint         # ESLint');
  console.log('  npm run format       # Prettier write');
  console.log('  npm run format:check # Prettier check');
  console.log('  npm run typecheck    # TS type checking');
  console.log('\nHappy building!');
};

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
  installNodeTypes(appPath);
  updateCssForTailwind(appPath);
  updateTsconfig(appPath);
  updateViteConfig(appPath);
  scaffoldUi(appPath);
  addLintAndFormatConfigs(appPath);
  updateProjectReadme(appPath, appName);
  printNextSteps(appName);
}

export default main;
