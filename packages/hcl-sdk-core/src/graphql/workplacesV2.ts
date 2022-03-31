import { gql } from 'graphql-request';
import { FRAGMENT_WORKPLACE_CORE } from './fragmentWorkplace';
import { graphqlClient } from './helpers';
import { WorkplacesV2QueryVariables, WorkplacesV2Query } from './types';

const QUERY_WORKPLACES_V2 = gql`
  query workplacesV2(
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
    workplacesV2(
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

export default function workplacesV2(variables: WorkplacesV2QueryVariables, config?): Promise<WorkplacesV2Query> {
  return graphqlClient(QUERY_WORKPLACES_V2, variables, config);
}
