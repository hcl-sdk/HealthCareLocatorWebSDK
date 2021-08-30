import { gql } from 'graphql-request';
import { graphqlClient } from './helpers'
import { CodeResult, QueryCodesByLabelArgs } from './types';

interface LabelsByCodeResult {
  labelsByCode: CodeResult
}

const QUERY_LABEL_BY_CODE = gql`
  query labelsByCode($first: Int!, $offset: Int, $criteria: String, $codeTypes: [String!]!, $locale: String, $country: String) {
    labelsByCode(
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

export default function labelsByCode(variables: QueryCodesByLabelArgs, config?): Promise<LabelsByCodeResult> {
  return graphqlClient(QUERY_LABEL_BY_CODE, variables, config)
}
