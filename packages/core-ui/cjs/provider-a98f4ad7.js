'use strict';

const index = require('./index-a9a27258.js');
const stateTunnel = require('./state-tunnel-786a62ce.js');

const initState = {
  activatedRoute: '/'
};
const RouterStore = stateTunnel.createProviderConsumer(initState, (subscribe, child) => index.h("context-consumer", { subscribe: subscribe, renderer: child }));

exports.RouterStore = RouterStore;
