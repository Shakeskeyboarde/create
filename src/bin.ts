import fs from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';

import chalk from 'chalk';
import { $ as create$, type TemplateExpression } from 'execa';

const $$ = create$({
  stdio: 'inherit',
  preferLocal: true,
});

const $ = (template: TemplateStringsArray, ...values: TemplateExpression[]): ReturnType<typeof $$> => {
  const cmd = template.slice(1).reduce((acc, str, i) => `${acc}"${values[i]}"${str}`, template[0]);
  console.error(chalk.dim(`> ${cmd}`));
  return $$(template, ...values);
};

const cp = async (filename: string): Promise<void> => {
  console.error(chalk.gray(`create: ${filename}`));

  const from = path.resolve(__dirname, '..', filename);
  const to = path.resolve(filename);

  await fs.cp(from, to, {
    recursive: true,
    force: false,
  });
};

const write = async (filename: string, content: unknown): Promise<void> => {
  console.error(chalk.gray(`create: ${filename}`));

  await fs.writeFile(
    filename,
    typeof content === 'string' ? content : JSON.stringify(content, null, 2),
    {
      encoding: 'utf-8',
      flag: 'wx',
    },
  ).catch((error: any) => {
    if (error?.code === 'EEXIST') return;
    throw error;
  });
};

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

await write('package.json', {
  private: true,
  name: 'UNTITLED',
  description: '',
  version: '0.0.0-prerelease',
  license: 'ISC',
  repository: {
    type: 'git',
    url: 'https://github.com/Shakeskeyboarde/UNTITLED.git',
  },
  scripts: {
    start: 'vite',
    build: 'vite build',
    test: 'eslint . --max-warnings=0 && vitest run --pass-with-no-tests',
    'open-coverage': 'open out/coverage/index.html',
  },
  files: [
    'lib',
  ],
  publishConfig: {
    access: 'public',
    tag: 'prerelease',
  },
  type: 'module',
  types: './dist/index.d.ts',
  exports: {
    '.': {
      types: './dist/index.d.ts',
      import: './dist/index.js',
    },
  },
});

await cp('.github');
await cp('.gitignore');
await cp('eslint.config.js');
await cp('LICENSE');
await cp('tsconfig.json');
await cp('vite.config.ts');
await cp('vitest.setup.ts');
await cp('src/index.ts');

await $`corepack enable`;
await $`corepack use pnpm@latest`;
await $`pnpm i -D typescript @types/node eslint@^8 eslint-config-rational vitest @vitest/coverage-v8`;

if (await fs.access('.git').then(() => false, () => true)) {
  await $`git init`;
  await $`git add .`;
  await $`git commit -m ${'chore: initial commit'}`;
}
