import { gql } from 'graphql-request';
import { graphqlClient } from './helpers'
import { ActivityResult, QueryActivitiesArgs } from './types';

interface ActivitiesResult {
  activities: ActivityResult[];
}

const QUERY_ACTIVITIES = gql`
  query activities($first: Int!, $offset: Int!, $specialties: [String!], $county: String, $country: String, $location: GeopointQuery, $criteria: String, $criterias: [ActivityCriteria], $medTerms: [String!], $criteriaScope: ActivityCriteriaScope, $locale: String) {
    activities(
      first: $first
      offset: $offset
      specialties: $specialties
      county: $county
      country: $country
      location: $location
      criteria: $criteria
      criterias: $criterias
      criteriaScope: $criteriaScope
      medTerms: $medTerms
      locale: $locale
    ) {
      distance
      relevance
      activity {
        id
        url {
          doctolib
          arzttermine
        }
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
          uci {
            rpps
            adeli
          }
          reviewsAvailable
          diseasesAvailable
        }
        workplace {
          id
          openHours {
            day
            openPeriods {
              open
              close
            }
          }
          address {
            longLabel
            buildingLabel
            county {
              label
            }
            postalCode
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