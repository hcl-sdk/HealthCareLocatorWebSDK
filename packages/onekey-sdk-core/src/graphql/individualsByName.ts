import { gql } from 'graphql-request';
import { graphqlClient } from './helpers'
import { IndividualResult, QueryIndividualsByNameArgs } from './types';

interface IndividualByNameResult {
  individualsByName: IndividualResult
}

const QUERY_INDIVIDUAL_BY_NAME = gql`
  query individualsByName($apiKey: String!, $first: Int!, $offset: Int!, $criteria: String!, $locale: String) {
    individualsByName(
        apiKey: $apiKey
        criteria: $criteria
        locale: $locale
        first: $first
        offset: $offset
      ) {
        individuals {
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
              address {longLabel, county { label } ,country }
            }
          }
        }
    }
    }
`

export default function individualsByName(variables: QueryIndividualsByNameArgs): Promise<IndividualByNameResult> {
  return graphqlClient(QUERY_INDIVIDUAL_BY_NAME, variables)
}