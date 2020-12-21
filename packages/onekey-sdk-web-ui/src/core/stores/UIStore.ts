import StoreProvider from './StoreProvider';
import { Breakpoint } from 'onekey-sdk-web-ui/src/core/types';
import { getBreakpointFromParentClientRect } from 'onekey-sdk-web-ui/src/utils/helper';

interface UIStoreState {
  breakpoint: Breakpoint;
  parentClientRect: DOMRect | null;
}

const initialState = {
  breakpoint: {
    screenSize: 'unknown' as const,
    orientation: 'unknown' as const,
  },
  parentClientRect: null
}

export default class UIStore extends StoreProvider<UIStoreState> {
  constructor() {
    super(initialState);
  }

  public setParentDims(parentClientRect: DOMRect) {
    this.setState({
      ...this.state,
      parentClientRect,
      breakpoint: getBreakpointFromParentClientRect(parentClientRect)
    })
  }
}
