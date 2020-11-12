import { SetStore, StoreProps } from '../../onekey-sdk-store/provider';
export declare class OnekeySdkSearchResult {
  store: StoreProps;
  setStore: SetStore;
  hcpNearMeLocations: any[];
  componentDidLoad(): void;
  watchHandler(newValue: StoreProps): void;
  onItemCardClick: () => void;
  render(): any;
}
