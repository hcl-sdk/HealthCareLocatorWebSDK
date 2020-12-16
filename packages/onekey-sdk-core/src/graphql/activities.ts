import { gql } from 'graphql-request';
import { graphqlClient } from './helpers'
import { ActivityResult, QueryActivitiesArgs } from './types';

interface ActivitiesResult {
  activities: ActivityResult[];
}

const QUERY_ACTIVITIES = gql`
  query activities($apiKey: String!, $first: Int!, $offset: Int!, $specialties: [String!], $county: String) {
    activities(
      apiKey: $apiKey
      first: $first
      offset: $offset
      specialties: $specialties
      county: $county
    ) {
      distance
      relevance
      activity {
        id
        individual {
          id
          firstName
          lastName
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
          }
        }
      }
    }
  }
`

export default function activities(variables: QueryActivitiesArgs): Promise<ActivitiesResult> {
  return graphqlClient(QUERY_ACTIVITIES, variables)
}