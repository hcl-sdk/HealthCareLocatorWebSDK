import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { reactOutputTarget } from '@stencil/react-output-target';
import { angularOutputTarget, ValueAccessorConfig } from '@stencil/angular-output-target';
import { vueOutputTarget, ComponentModelConfig } from '@stencil/vue-output-target';

export const config: Config = {
  namespace: 'onekey-sdk',
  globalScript: 'src/global/app.ts',
  globalStyle: 'src/global/app.scss',
  taskQueue: 'async',
  hashFileNames: false,
  outputTargets: [
    reactOutputTarget({
      componentCorePackage: 'onekey-sdk',
      proxiesFile: './packages/reactjs/src/components.ts',
      // excludeComponents: ['context-consumer', 'stencil-async-content']
    }),
    angularOutputTarget({
      componentCorePackage: 'onekey-sdk',
      directivesProxyFile: './packages/angular/src/directives/proxies.ts',
      // valueAccessorConfigs: angularValueAccessorBindings,
    }),
    vueOutputTarget({
      componentCorePackage: 'onekey-sdk',
      proxiesFile: './packages/vuejs/src/proxies.ts',
      // componentModels: vueComponentModels,
    }),
    {
      type: 'docs-readme',
      dir: 'docs',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
    {
      type: 'dist',
      dir: "packages/core-ui"
    },
  ],
  plugins: [
    sass({
      injectGlobalPaths: [
        'src/global/scss/variables.scss',
        'src/global/scss/materialize.scss'
      ]
    })
  ],
  buildEs5: "prod",
  extras: {
    shadowDomShim: true
  },
  preamble: 'Built by OneKey SDK'
};
