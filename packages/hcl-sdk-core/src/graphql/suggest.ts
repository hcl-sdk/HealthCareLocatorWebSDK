import { gql } from 'graphql-request';
import { graphqlClient } from './helpers';
import { SuggestionsQuery, SuggestionsQueryVariables } from './types';

const QUERY_SUGGEST = gql`
  query suggestions(
    $criteria: String
    $scope: SuggestionScope
    $country: String
    $specialties: [String!]
    $medTerms: [String!]
    $location: GeopointQuery
    $locale: String
    $first: Int
  ) {
    suggestions(
      first: $first
      criteria: $criteria
      scope: $scope # Individual / Specialty / Address / MedTerm
      country: $country

      specialties: $specialties # e.g. code "SP.WFR.NE" for "Neurology", "SP.WFR.AR" for Cardiology
      medTerms: $medTerms # e.g. code "ENZYME_ACTIVATION" for "enzyme activation"
      location: $location #e.g. Paris: {lat: 48.86, lon:2.29, distanceMeter: 20000
      locale: $locale
    ) {
      edges {
        node {
          # results.individual
          individual {
            firstName
            lastName
            middleName

            activity {
              id
              workplace {
                address {
                  longLabel
                  county {
                    label
                  }
                  city {
                    label
                  }
                  postalCode
                  location {
                    lat
                    lon
                  }
                }
              }
            }

            specialties {
              code
              label
            }

            medTerms {
              code
              label
            }
          }

          # results.address
          address {
            longLabel
            country
            postalCode
            city {
              label
            }
          }

          workplace {
            id
            name
            type {
              label
            }
          }

          # results.specialty
          specialty {
            code
            label
          }

          # results.medTerm
          medTerm {
            code
            label
          }
        }
      }
    }
  }
`;

export default function suggest(variables: SuggestionsQueryVariables, config?): Promise<SuggestionsQuery> {
  return graphqlClient(QUERY_SUGGEST, variables, config);
}
