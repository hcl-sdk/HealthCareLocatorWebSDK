import { gql } from 'graphql-request';
import { graphqlClient } from './helpers'
import { IndividualResult, QueryIndividualsByNameArgs } from './types';

interface IndividualByNameResult {
  individualsByName: IndividualResult
}

const QUERY_INDIVIDUAL_BY_NAME = gql`
  query individualsByName($first: Int!, $offset: Int!, $criteria: String!, $locale: String) {
    individualsByName(
        criteria: $criteria
        locale: $locale
        first: $first
        offset: $offset
      ) {
        individuals {
          id
          firstName
          middleName
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
`

export default function individualsByName(variables: QueryIndividualsByNameArgs, config?): Promise<IndividualByNameResult> {
  return graphqlClient(QUERY_INDIVIDUAL_BY_NAME, variables, config)
}