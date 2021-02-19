import { Config } from '@stencil/core';
import replace from 'rollup-plugin-replace';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({
  path: path.resolve(process.cwd(), '../../.env')
});

export const config: Config = {
  namespace: 'devtools',
  buildEs5: true,
  taskQueue: 'async',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements-bundle',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  plugins: [
    replace({
      exclude: 'node_modules/**',
      'process.env.API_GRAPHQL_HOST': JSON.stringify(process.env.API_GRAPHQL_HOST)
    }),
  ],
};
