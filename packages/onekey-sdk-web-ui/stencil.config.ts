import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
// https://stenciljs.com/docs/config

export const config: Config = {
  namespace: 'onekey-sdk',
  globalScript: 'src/global/app.ts',
  globalStyle: 'src/global/app.scss',
  taskQueue: 'async',
  hashFileNames: false,
  outputTargets: [
    {
      type: 'docs-readme',
      dir: 'docs',
    },
    {
      type: 'dist'
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    }
  ],
  plugins: [
    sass({
      injectGlobalPaths: [
        'src/global/scss/variables.scss',
      ]
    })
  ],
  buildEs5: "prod",
  extras: {
    shadowDomShim: true
  },
  preamble: 'Built by OneKey SDK'
};
