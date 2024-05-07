import { defineConfig } from 'vitest/config';

process.chdir(__dirname);

export default defineConfig({
  test: {
    reporters: ['verbose'],
    setupFiles: 'vitest.setup.ts',
    coverage: {
      enabled: true,
      all: true,
      reporter: ['html', 'text-summary'],
      reportsDirectory: 'out/coverage',
      include: ['**/src/**/*.?(c|m)[jt]s?(x)'],
      exclude: ['**/*.{test|spec}.*', '**/__{tests|mocks}__'],
    },
  },
});
