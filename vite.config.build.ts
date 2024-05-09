import externals from 'rollup-plugin-node-externals';
import { defineConfig, mergeConfig } from 'vite';

import baseConfig from './vite.config.js';

process.chdir(__dirname);

export default mergeConfig(baseConfig, defineConfig({
  plugins: [externals()],
  // XXX: Replace build config with the vite-plugin-auto-lib configuration when ready.
  build: {
    target: 'esnext',
    sourcemap: true,
    minify: false,
    lib: {
      entry: './src/bin.ts',
      formats: ['es'],
      fileName: '[name].js',
    },
    rollupOptions: {
      treeshake: false,
      output: { preserveModules: true },
    },
  },
}));
