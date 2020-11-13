import 'ionicons';
export declare class OnekeySdkSearch {
  formData: {
    name: string;
    address: string;
  };
  searchResult: any[];
  selectedAddress: any;
  private onSearch;
  private onChange;
  onSelectAddress: (addr: any) => void;
  render(): any;
}
