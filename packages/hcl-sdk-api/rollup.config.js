import resolveModule from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescriptPlugin from 'rollup-plugin-typescript2';
import typescript from 'typescript';
import json from '@rollup/plugin-json';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import { terser } from "rollup-plugin-terser";
import dotenv from 'dotenv';
import appPkg from './package.json';
import replace from 'rollup-plugin-replace';
import path from 'path';

dotenv.config({
  path: path.resolve(process.cwd(), '../../.env')
});

const GLOBAL_NAME = 'HclAPI';

const plugins = [
  resolveModule({
    browser: true,
    mainFields: ['browser'],
  }),
  typescriptPlugin({
    typescript,
    include: ['../**/src/**/*.ts'],
  }),
  json(),
  commonjs(),
  getBabelOutputPlugin({
    allowAllFormats: true,
    presets: [['@babel/preset-env', { modules: 'umd' }]],
  }),
  terser(),
  replace({
    exclude: 'node_modules/**',
    'process.env.API_GRAPHQL_HOST': JSON.stringify(process.env.API_GRAPHQL_HOST),
  }),
];

export default [
  {
    input: 'src/index.ts',
    output: {
      file: appPkg.browser,
      sourcemap: true,
      format: 'iife',
      name: GLOBAL_NAME,
    },
    plugins
  }
];
