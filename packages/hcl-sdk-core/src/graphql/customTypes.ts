import { Exact, InputMaybe, Scalars } from './types';

export type ServiceWorkplaceByIdQuery = {
  __typename?: 'Query';
  workplaceByID?:
    | {
        __typename?: 'Workplace';
        children?:
          | Array<
              | {
                  __typename?: 'Workplace';
                  id: string;
                  name?: string | null | undefined;
                  officialName?: string | null | undefined;
                  intlPhone?: string | null | undefined;
                  intlFax?: string | null | undefined;
                  webAddress?: string | null | undefined;
                  individuals?:
                    | Array<
                        | {
                            __typename?: 'Individual';
                            id: string;
                            firstName?: string | null | undefined;
                            lastName?: string | null | undefined;
                            middleName?: string | null | undefined;
                            reviewsAvailable?: boolean | null | undefined;
                            diseasesAvailable?: boolean | null | undefined;
                            mainActivity?:
                              | {
                                  __typename?: 'Activity';
                                  id: string;
                                  urls?:
                                    | Array<
                                        | {
                                            __typename?: 'Url';
                                            url?: { __typename?: 'UrlDetail'; generated?: string | null | undefined; webcrawled?: string | null | undefined } | null | undefined;
                                          }
                                        | null
                                        | undefined
                                      >
                                    | null
                                    | undefined;
                                }
                              | null
                              | undefined;
                            specialties?: Array<{ __typename?: 'KeyedString'; code: string; label: string } | null | undefined> | null | undefined;
                          }
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                  children?:
                    | Array<
                        | {
                            __typename?: 'Workplace';
                            id: string;
                            name?: string | null | undefined;
                            officialName?: string | null | undefined;
                            intlPhone?: string | null | undefined;
                            intlFax?: string | null | undefined;
                            webAddress?: string | null | undefined;
                            individuals?:
                              | Array<
                                  | {
                                      __typename?: 'Individual';
                                      id: string;
                                      firstName?: string | null | undefined;
                                      lastName?: string | null | undefined;
                                      middleName?: string | null | undefined;
                                      reviewsAvailable?: boolean | null | undefined;
                                      diseasesAvailable?: boolean | null | undefined;
                                      mainActivity?:
                                        | {
                                            __typename?: 'Activity';
                                            id: string;
                                            urls?:
                                              | Array<
                                                  | {
                                                      __typename?: 'Url';
                                                      url?:
                                                        | { __typename?: 'UrlDetail'; generated?: string | null | undefined; webcrawled?: string | null | undefined }
                                                        | null
                                                        | undefined;
                                                    }
                                                  | null
                                                  | undefined
                                                >
                                              | null
                                              | undefined;
                                          }
                                        | null
                                        | undefined;
                                      specialties?: Array<{ __typename?: 'KeyedString'; code: string; label: string } | null | undefined> | null | undefined;
                                    }
                                  | null
                                  | undefined
                                >
                              | null
                              | undefined;
                            children?:
                              | Array<
                                  | {
                                      __typename?: 'Workplace';
                                      id: string;
                                      name?: string | null | undefined;
                                      officialName?: string | null | undefined;
                                      intlPhone?: string | null | undefined;
                                      intlFax?: string | null | undefined;
                                      webAddress?: string | null | undefined;
                                      individuals?:
                                        | Array<
                                            | {
                                                __typename?: 'Individual';
                                                id: string;
                                                firstName?: string | null | undefined;
                                                lastName?: string | null | undefined;
                                                middleName?: string | null | undefined;
                                                reviewsAvailable?: boolean | null | undefined;
                                                diseasesAvailable?: boolean | null | undefined;
                                                mainActivity?:
                                                  | {
                                                      __typename?: 'Activity';
                                                      id: string;
                                                      urls?:
                                                        | Array<
                                                            | {
                                                                __typename?: 'Url';
                                                                url?:
                                                                  | { __typename?: 'UrlDetail'; generated?: string | null | undefined; webcrawled?: string | null | undefined }
                                                                  | null
                                                                  | undefined;
                                                              }
                                                            | null
                                                            | undefined
                                                          >
                                                        | null
                                                        | undefined;
                                                    }
                                                  | null
                                                  | undefined;
                                                specialties?: Array<{ __typename?: 'KeyedString'; code: string; label: string } | null | undefined> | null | undefined;
                                              }
                                            | null
                                            | undefined
                                          >
                                        | null
                                        | undefined;
                                      type?: { __typename?: 'KeyedString'; code: string; label: string } | null | undefined;
                                      address?:
                                        | {
                                            __typename?: 'Address';
                                            buildingLabel?: string | null | undefined;
                                            longLabel?: string | null | undefined;
                                            country?: string | null | undefined;
                                            postalCode?: string | null | undefined;
                                            city?: { __typename?: 'KeyedString'; label: string } | null | undefined;
                                            location?: { __typename?: 'Geopoint'; lat: number; lon: number } | null | undefined;
                                          }
                                        | null
                                        | undefined;
                                    }
                                  | null
                                  | undefined
                                >
                              | null
                              | undefined;
                            type?: { __typename?: 'KeyedString'; code: string; label: string } | null | undefined;
                            address?:
                              | {
                                  __typename?: 'Address';
                                  buildingLabel?: string | null | undefined;
                                  longLabel?: string | null | undefined;
                                  country?: string | null | undefined;
                                  postalCode?: string | null | undefined;
                                  city?: { __typename?: 'KeyedString'; label: string } | null | undefined;
                                  location?: { __typename?: 'Geopoint'; lat: number; lon: number } | null | undefined;
                                }
                              | null
                              | undefined;
                          }
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                  type?: { __typename?: 'KeyedString'; code: string; label: string } | null | undefined;
                  address?:
                    | {
                        __typename?: 'Address';
                        buildingLabel?: string | null | undefined;
                        longLabel?: string | null | undefined;
                        country?: string | null | undefined;
                        postalCode?: string | null | undefined;
                        city?: { __typename?: 'KeyedString'; label: string } | null | undefined;
                        location?: { __typename?: 'Geopoint'; lat: number; lon: number } | null | undefined;
                      }
                    | null
                    | undefined;
                }
              | null
              | undefined
            >
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type ServicesByWorkplaceIdVariables = Exact<{
  id: Scalars['ID'];
  locale?: InputMaybe<Scalars['String']>;
  firstService?: Scalars['Int'];
  offsetFirstService?: Scalars['Int'];
  firstIndividual?: Scalars['Int'];
  offsetFirstIndividual?: Scalars['Int'];
  secondService?: Scalars['Int'];
  offsetSecondService?: Scalars['Int'];
  secondIndividual?: Scalars['Int'];
  offsetSecondIndividual?: Scalars['Int'];
  thirdService?: Scalars['Int'];
  offsetThirdService?: Scalars['Int'];
  thirdIndividual?: Scalars['Int'];
  offsetThirdIndividual?: Scalars['Int'];
}>;
