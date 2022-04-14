import { gql } from 'graphql-request';
import { graphqlClient } from './helpers';
import { CodesByLabelQuery, CodesByLabelQueryVariables } from './types';

const QUERY_CODE_BY_LABEL = gql`
  query codesByLabel($first: Int!, $offset: Int!, $criteria: String, $codeTypes: [String!]!, $locale: String, $country: String, $criteriaScope: CodeCriteriaScope) {
    codesByLabel(codeTypes: $codeTypes, criteria: $criteria, first: $first, offset: $offset, locale: $locale, country: $country, criteriaScope: $criteriaScope) {
      edges {
        node {
          id
          lisCode
          lisLbl
          longLbl
        }
      }
    }
  }
`;

export default function codesByLabel(variables: CodesByLabelQueryVariables, config?): Promise<CodesByLabelQuery> {
  return graphqlClient(QUERY_CODE_BY_LABEL, variables, config);
}
