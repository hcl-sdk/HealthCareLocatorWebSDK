interface IAddressDetail {
  city: string;
  state: string;
  country_code: string;
}

export type IGeoMapSearchResult =
  | {
      name: string;
      lat: number;
      lng: number;
      addressDetails?: IAddressDetail;
      boundingbox: string[];
      type: string;
    }
  | {
      name: string;
      place_id: string;
      type: string;
    };

export interface IAddressFromGeo {
  address: {
    country_code: string;
  };
  boundingbox: string[];
  addressDetails: {
    city: string;
    state: string;
    country_code: string;
    country: string;
  };
  shortDisplayName: string;
}

export interface GeoProvider {
  searchGeoMap(options: { address: string; countrycode?: string }): Promise<IGeoMapSearchResult[]>;
  getAddressFromGeo(lat: number, lng: number): Promise<IAddressFromGeo | null>;
}
