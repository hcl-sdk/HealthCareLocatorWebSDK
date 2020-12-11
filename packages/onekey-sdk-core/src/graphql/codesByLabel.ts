import { gql } from 'graphql-request';
import { graphqlClient } from './helpers'

interface CodesByLabelVariable {
  apiKey: string
  first: number
  offset: number
  criteria: string
  codeTypes: string[]
  locale?: string
}

const QUERY_CODE_BY_LABEL = gql`
  query codesByLabel($apiKey: String!, $first: Int!, $offset: Int!, $criteria: String!, $codeTypes: [String!], $locale: String) {
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

export default function codesByLabel(variables: CodesByLabelVariable) {
  return graphqlClient(QUERY_CODE_BY_LABEL, variables)
}