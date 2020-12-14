import { gql } from 'graphql-request';
import { graphqlClient } from './helpers'
import { CodeResult, QueryCodesByLabelArgs } from './types';

interface CodeByLabelResult {
  codesByLabel: CodeResult
}

const QUERY_CODE_BY_LABEL = gql`
  query codesByLabel($apiKey: String!, $first: Int!, $offset: Int!, $criteria: String!, $codeTypes: [String!]!, $locale: String) {
    codesByLabel(
      apiKey: $apiKey
      codeTypes: $codeTypes
      criteria: $criteria
      first: $first
      offset: $offset
      locale: $locale
    )  {
      codes {
        id
        lisCode
        lisLbl
        longLbl
      }
    }
  }
`

export default function codesByLabel(variables: QueryCodesByLabelArgs): Promise<CodeByLabelResult> {
  return graphqlClient(QUERY_CODE_BY_LABEL, variables)
}