import 'ionicons';
export declare class OnekeySdkSearch {
  setStore: any;
  store: any;
  setActivatedRoute: any;
  formData: {
    name: string;
    address: string;
  };
  searchResult: any[];
  selectedAddress: any;
  provider: any;
  private onSearch;
  private onChange;
  onSelectAddress: (addr: any) => void;
  render(): any;
}
