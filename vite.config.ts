import { join } from 'path';

import react from '@vitejs/plugin-react';
import { ConfigEnv, UserConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

const srcRoot = join(__dirname, 'src');

export default ({ command }: ConfigEnv): UserConfig => {
  // DEV
  if (command === 'serve') {
    return {
      root: srcRoot,
      base: '/',
      plugins: [react(), svgr()],
      resolve: {
        alias: {
          '/@': srcRoot,
        },
      },
      build: {
        outDir: join(__dirname, '/dist_renderer'),
        emptyOutDir: true,
        rollupOptions: {},
      },
      server: {
        port: process.env.PORT === undefined ? 3000 : +process.env.PORT,
      },
      optimizeDeps: {
        exclude: ['path'],
      },
    };
  }
  // PROD
  return {
    root: srcRoot,
    base: './',
    plugins: [react(), svgr()],
    resolve: {
      alias: {
        '/@': srcRoot,
      },
    },
    build: {
      outDir: join(__dirname, '/dist_renderer'),
      emptyOutDir: true,
      rollupOptions: {},
    },
    server: {
      port: process.env.PORT === undefined ? 3000 : +process.env.PORT,
    },
    optimizeDeps: {
      exclude: ['path'],
    },
  };
};
