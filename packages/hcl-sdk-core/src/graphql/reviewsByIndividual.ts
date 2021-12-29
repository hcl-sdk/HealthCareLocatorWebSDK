import { gql } from 'graphql-request';
import { graphqlClient } from './helpers'
import { ReviewResult, QueryReviewsByIndividualArgs } from './types';

interface ReviewsByIndividualResult {
  reviewsByIndividual: ReviewResult
}

const QUERY_REVIEWS_BY_INDIVIDUAL = gql`
  query reviewsByIndividual($idnat: String!) {
    reviewsByIndividual(
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

export default function reviewsByIndividual(variables: QueryReviewsByIndividualArgs, config?): Promise<ReviewsByIndividualResult> {
  return graphqlClient(QUERY_REVIEWS_BY_INDIVIDUAL, variables, config)
}