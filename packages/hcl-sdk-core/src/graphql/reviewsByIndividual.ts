import { gql } from 'graphql-request';
import { graphqlClient } from './helpers'
import { ReviewsByIndividualQueryVariables, ReviewsByIndividualQuery } from './types';

const QUERY_REVIEWS_BY_INDIVIDUAL = gql`
  query reviewsByIndividual($idnat: String!) {
    reviews(
      idnat: $idnat
    ) {
      rpps
      adeli
      idnat
      diseases { id, name }
      reviews { text, reviewer, createdAt, diseases { id, name } }
    }
  }
`

export default function reviewsByIndividual(variables: ReviewsByIndividualQueryVariables, config?): Promise<ReviewsByIndividualQuery> {
  return graphqlClient(QUERY_REVIEWS_BY_INDIVIDUAL, variables, config);
}