import { gql } from 'graphql-request';
import { graphqlClient } from './helpers';
const QUERY_INDIVIDUAL_BY_NAME = gql `
  query individualsByName($first: Int!, $offset: Int!, $criteria: String!, $locale: String) {
    individualsByName(
        criteria: $criteria
        locale: $locale
        first: $first
        offset: $offset
      ) {
        individuals {
          mailingName
          id
          firstName
          lastName
          professionalType { label }
          specialties {
            label
          }
          mainActivity {
            id
            workplace {
              address {
                longLabel
                county { label }
                city { label }
                country
                location {
                  lat
                  lon
                }
              }
            }
          }
        }
    }
    }
`;
export default function individualsByName(variables, config) {
  return graphqlClient(QUERY_INDIVIDUAL_BY_NAME, variables, config);
}