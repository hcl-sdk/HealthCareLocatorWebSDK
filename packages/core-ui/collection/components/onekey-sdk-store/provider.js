import { h } from '@stencil/core';
import { createProviderConsumer } from "@stencil/state-tunnel";
export const initState = {
  store: {
    config: {},
    hcpNearMe: [],
    hcpLastSearch: [],
    hcpConsulted: []
  }
};
export const Store = createProviderConsumer(initState, (subscribe, child) => h("context-consumer", { subscribe: subscribe, renderer: child }));
