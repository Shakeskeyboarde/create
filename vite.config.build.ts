import externals from 'rollup-plugin-node-externals';
import { defineConfig, mergeConfig } from 'vite';
import bin from 'vite-plugin-bin';
import { lib } from 'vite-plugin-config-lib';
import dts from 'vite-plugin-dts';

import baseConfig from './vite.config.js';

process.chdir(__dirname);

export default mergeConfig(baseConfig, defineConfig({
  plugins: [
    lib(),
    externals(),
    bin(),
    dts({
      entryRoot: 'src',
      logLevel: 'error',
      exclude: ['**/*.{test|spec}.*', '**/__{tests|mocks}__'],
    }),
  ],
  build: { target: 'node18' },
}));
