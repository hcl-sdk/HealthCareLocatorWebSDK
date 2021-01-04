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
      type: 'dist',
      copy: [
        { src: 'i18n' }
      ]
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
      copy: [
        { src: 'i18n' }
      ]
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
