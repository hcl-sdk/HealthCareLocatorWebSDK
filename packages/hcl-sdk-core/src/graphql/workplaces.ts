import { gql } from 'graphql-request';
import { FRAGMENT_WORKPLACE_CORE } from './fragmentWorkplace';
import { graphqlClient } from './helpers';
import { WorkplacesQuery, WorkplacesQueryVariables } from './types';

const QUERY_WORKPLACES = gql`
  query workplaces(
    $first: Int!
    $offset: Int!
    $criteria: String
    $criterias: [WorkplaceCriteria]
    $criteriaScope: WorkplaceCriteriaScope
    $country: String
    $location: GeopointQuery
    $locale: String
    $sorts: [WorkplaceSortScope]
    $sortScope: WorkplaceSortScope
  ) {
    workplaces(
      first: $first
      offset: $offset
      criteria: $criteria
      criterias: $criterias
      criteriaScope: $criteriaScope
      country: $country
      location: $location
      locale: $locale
      sorts: $sorts
      sortScope: $sortScope
    ) {
      edges {
        distance
        node {
          ...WorkplaceCore
        }
      }
    }
  }
  ${FRAGMENT_WORKPLACE_CORE}
`;

export default function workplaces(variables: WorkplacesQueryVariables, config?): Promise<WorkplacesQuery> {
  return graphqlClient(QUERY_WORKPLACES, variables, config);
}
