import StoreProvider from './StoreProvider';
import { Breakpoint } from '../../core/types';
import { getBreakpointFromParentClientRect } from '../../utils/helper';

interface UIStoreState {
  breakpoint: Breakpoint;
  parentClientRect: DOMRect | null;
}

const initialState = {
  breakpoint: {
    screenWidth: 0,
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
