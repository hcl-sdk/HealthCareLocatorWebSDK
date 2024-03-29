import { gql } from 'graphql-request';
import { graphqlClient } from './helpers';
import { ActivitiesQuery, QueryActivitiesArgs } from './types';
import { FRAGMENT_URL } from './fragmentUrl';

const QUERY_ACTIVITIES = gql`
  query activities(
    $first: Int!
    $offset: Int!
    $specialties: [String!]
    $county: String
    $country: String
    $location: GeopointQuery
    $criteria: String
    $criterias: [ActivityCriteria]
    $medTerms: [String!]
    $criteriaScope: ActivityCriteriaScope
    $sorts: [ActivitySortScope]
    $locale: String
  ) {
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
      sorts: $sorts
      locale: $locale
    ) {
      edges {
        distance
        relevance
        node {
          id
          urls {
            url {
              ...Url
            }
          }
          individual {
            id
            firstName
            lastName
            middleName
            professionalType {
              label
            }
            specialties {
              code
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
  }
  ${FRAGMENT_URL}
`;

export default function activities(variables: QueryActivitiesArgs, config?): Promise<ActivitiesQuery> {
  return graphqlClient(QUERY_ACTIVITIES, variables, config);
}
