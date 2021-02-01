import { gql } from 'graphql-request';
import { graphqlClient } from './helpers';
const QUERY_ACTIVITIES = gql `
  query activities($first: Int!, $offset: Int!, $specialties: [String!], $county: String, $location: GeopointQuery) {
    activities(
      first: $first
      offset: $offset
      specialties: $specialties
      county: $county
      location: $location
    ) {
      distance
      relevance
      activity {
        id
        individual {
          mailingName
          id
          firstName
          lastName
          professionalType { label }
          specialties {
            label
          }
        }
        workplace {
          id
          address {
            longLabel
            buildingLabel
            county {
              label
            }
            city {
              label
            }
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
`;
export default function activities(variables, config) {
  return graphqlClient(QUERY_ACTIVITIES, variables, config);
}