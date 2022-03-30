import { gql } from 'graphql-request';

export const FRAGMENT_WORKPLACE_CORE = gql`
  fragment WorkplaceCore on Workplace {
    id
    name
    type {
      code
      label
    }
    officialName
    intlPhone
    intlFax
    webAddress
    address {
      buildingLabel
      longLabel
      city {
        label
      }
      country
      postalCode
      location {
        lat
        lon
      }
    }
  }
`;
