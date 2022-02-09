import { gql } from 'graphql-request';
import { graphqlClient } from './helpers';
import { SuggestQueryVariables, SuggestResult } from './types';

type SuggestQueryResult ={ 
  suggest: SuggestResult
}

const QUERY_SUGGEST = gql`
  query suggest(
    $criteria: String
    $scope: SuggestScope
    $country: String
    $specialties: [String!]
    $medTerms: [String!]
    $location: GeopointQuery
    $locale: String
    $first: Int
  ) {
    suggest(
      first: $first
      criteria: $criteria
      scope: $scope # Individual / Specialty / Address / MedTerm
      country: $country

      specialties: $specialties # e.g. code "SP.WFR.NE" for "Neurology", "SP.WFR.AR" for Cardiology
      medTerms: $medTerms # e.g. code "ENZYME_ACTIVATION" for "enzyme activation"
      location: $location #e.g. Paris: {lat: 48.86, lon:2.29, distanceMeter: 20000
      locale: $locale
    ) {
      from
      size
      total
      results {
        # results.individual
        individual {
          firstName
          lastName

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
`

export default function suggest(variables: SuggestQueryVariables, config?): Promise<SuggestQueryResult> {
  return graphqlClient(QUERY_SUGGEST, variables, config);
}
