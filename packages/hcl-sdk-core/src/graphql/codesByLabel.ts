import { gql } from 'graphql-request';
import { graphqlClient } from './helpers'
import { CodeResult, QueryCodesArgs } from './types';

interface CodeByLabelResult {
  codesByLabel: CodeResult
}

const QUERY_CODE_BY_LABEL = gql`
  query codesByLabel($first: Int!, $offset: Int!, $criteria: String, $codeTypes: [String!]!, $locale: String, $country: String) {
    codesByLabel(
      codeTypes: $codeTypes
      criteria: $criteria
      first: $first
      offset: $offset
      locale: $locale
      country: $country
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

export default function codesByLabel(variables: QueryCodesArgs, config?): Promise<CodeByLabelResult> {
  return graphqlClient(QUERY_CODE_BY_LABEL, variables, config)
}
