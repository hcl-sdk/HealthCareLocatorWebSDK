import { h } from '@stencil/core'
import { createProviderConsumer } from "@stencil/state-tunnel";

export interface State {
  activatedRoute: string;
  setActivatedRoute?(a: string): void
}

const initState = {
  activatedRoute: '/'
}

export const RouterStore = createProviderConsumer<State>(initState, (subscribe, child) => <context-consumer subscribe={subscribe} renderer={child} />)
