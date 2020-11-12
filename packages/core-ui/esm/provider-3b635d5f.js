import { h } from './index-675d59a8.js';
import { c as createProviderConsumer } from './state-tunnel-04c0b67a.js';

const initState = {
  activatedRoute: '/'
};
const RouterStore = createProviderConsumer(initState, (subscribe, child) => h("context-consumer", { subscribe: subscribe, renderer: child }));

export { RouterStore as R };
