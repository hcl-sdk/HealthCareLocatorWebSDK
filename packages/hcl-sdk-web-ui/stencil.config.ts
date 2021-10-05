import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import replace from 'rollup-plugin-replace';
import path from 'path';
import dotenv from 'dotenv';
import { reactOutputTarget } from '@stencil/react-output-target';
import { angularOutputTarget } from '@stencil/angular-output-target';

dotenv.config({
  path: path.resolve(process.cwd(), '../../.env')
});

export const config: Config = {
  namespace: 'hcl-sdk',
  globalScript: 'src/global/app.ts',
  globalStyle: 'src/global/app.scss',
  taskQueue: 'async',
  hashFileNames: false,
  outputTargets: [
    angularOutputTarget({
      componentCorePackage: '@healthcarelocator/sdk-web',
      directivesProxyFile: '../hcl-sdk-web-ui-angular/projects/hcl-sdk/src/directives/proxies.ts',
    }),
    reactOutputTarget({
      componentCorePackage: '@healthcarelocator/sdk-web',
      proxiesFile: '../hcl-sdk-web-ui-react/src/components.ts',
      includeDefineCustomElements: true,
    }),
    {
      type: 'docs-readme',
      dir: 'docs',
    },
    {
      type: 'dist',
      copy: [
        { src: 'i18n' }
      ],
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
    replace({
      exclude: 'node_modules/**',
      'process.env.API_GRAPHQL_HOST': JSON.stringify(process.env.API_GRAPHQL_HOST),
      'process.env.HCL_WEBSITE_HOST': JSON.stringify(process.env.HCL_WEBSITE_HOST),
      'process.env.DEFAULT_I18N_BUNDLE_PATH': JSON.stringify(process.env.DEFAULT_I18N_BUNDLE_PATH),
    }),
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
  preamble: 'Built by Hcl SDK'
};
