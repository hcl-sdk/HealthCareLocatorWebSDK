import { h } from '@stencil/core';
import { createProviderConsumer } from "@stencil/state-tunnel";
const initState = {
  activatedRoute: '/'
};
export const RouterStore = createProviderConsumer(initState, (subscribe, child) => h("context-consumer", { subscribe: subscribe, renderer: child }));
