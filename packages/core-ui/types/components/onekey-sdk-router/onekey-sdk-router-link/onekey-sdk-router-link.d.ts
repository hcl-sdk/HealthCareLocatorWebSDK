export declare class OneKeySDKRouterLink {
  activatedRoute: string;
  setActivatedRoute: Function;
  el: HTMLElement;
  match: boolean;
  url: string;
  activeClass: string;
  custom: string;
  anchorClass?: string;
  anchorRole?: string;
  anchorTitle?: string;
  anchorTabIndex?: string;
  anchorId?: string;
  ariaHaspopup?: string;
  ariaPosinset?: string;
  ariaSetsize?: number;
  ariaLabel?: string;
  computeMatch(): void;
  handleClick(e: MouseEvent): any;
  render(): any;
}
