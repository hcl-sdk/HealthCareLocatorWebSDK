import { gql } from 'graphql-request';
import { graphqlClient } from './helpers'
import { ActivityResult, QueryActivitiesArgs } from './types';

interface ActivitiesResult {
  activities: ActivityResult[];
}

const QUERY_ACTIVITIES = gql`
  query activities($first: Int!, $offset: Int!, $specialties: [String!], $county: String, $location: GeopointQuery, $criteria: String, $medTerms: [String!]) {
    activities(
      first: $first
      offset: $offset
      specialties: $specialties
      county: $county
      location: $location
      criteria: $criteria
      medTerms: $medTerms
    ) {
      distance
      relevance
      activity {
        id
        individual {
          id
          firstName
          lastName
          middleName
          professionalType { label }
          specialties {
            label
          }
          meshTerms
          kvTerms
          chTerms
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
`

export default function activities(variables: QueryActivitiesArgs, config?): Promise<ActivitiesResult> {
  return graphqlClient(QUERY_ACTIVITIES, variables, config)
}