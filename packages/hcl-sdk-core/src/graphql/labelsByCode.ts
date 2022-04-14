import { gql } from 'graphql-request';
import { graphqlClient } from './helpers';
import { LabelsByCodeQuery, LabelsByCodeQueryVariables } from './types';

const QUERY_LABEL_BY_CODE = gql`
  query labelsByCode($first: Int!, $offset: Int, $criteria: String, $codeTypes: [String!]!, $locale: String, $country: String) {
    labelsByCode(codeTypes: $codeTypes, criteria: $criteria, first: $first, offset: $offset, locale: $locale, country: $country) {
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

export default function labelsByCode(variables: LabelsByCodeQueryVariables, config?): Promise<LabelsByCodeQuery> {
  return graphqlClient(QUERY_LABEL_BY_CODE, variables, config);
}
