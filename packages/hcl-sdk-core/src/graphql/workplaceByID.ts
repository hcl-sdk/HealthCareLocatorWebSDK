import { gql } from 'graphql-request';
import { FRAGMENT_URL } from './fragmentUrl';
import { FRAGMENT_WORKPLACE_CORE } from './fragmentWorkplace';
import { graphqlClient } from './helpers';
import { WorkplaceByIdQuery, WorkplaceByIdQueryVariables } from './types';
import { ServiceWorkplaceByIdQuery, ServicesByWorkplaceIdVariables } from './customTypes';

const FRAGMENT_INDIVIDUAL_CORE = gql`
  fragment IndividualCore on Individual {
    id
    firstName
    lastName
    middleName
    reviewsAvailable
    diseasesAvailable
    mainActivity {
      id
      urls {
        url {
          ...Url
        }
      }
    }
    specialties {
      code
      label
    }
  }
  ${FRAGMENT_URL}
`;

const QUERY_WORKPLACE_BY_ID = gql`
  query workplaceByID($id: ID!, $locale: String) {
    workplaceByID(id: $id, locale: $locale) {
      ...WorkplaceCore
      children {
        ...WorkplaceCore
        individuals {
          ...IndividualCore
        }
        children {
          ...WorkplaceCore
          individuals {
            ...IndividualCore
          }
          children {
            ...WorkplaceCore
            individuals {
              ...IndividualCore
            }
          }
        }
      }
      individuals {
        ...IndividualCore
      }
    }
  }
  ${FRAGMENT_WORKPLACE_CORE}
  ${FRAGMENT_INDIVIDUAL_CORE}
`;
const QUERY_SERVICES_BY_WORKPLACE_BY_ID = gql`
  query workplaceByID(
    $id: ID!
    $locale: String
    $firstService: Int
    $offsetFirstService: Int
    $firstIndividual: Int
    $offsetFirstIndividual: Int
    $secondService: Int
    $offsetSecondService: Int
    $secondIndividual: Int
    $offsetSecondIndividual: Int
    $thirdService: Int
    $offsetThirdService: Int
    $thirdIndividual: Int
    $offsetThirdIndividual: Int
  ) {
    workplaceByID(id: $id, locale: $locale) {
      children(first: $firstService, offset: $offsetFirstService) {
        ...WorkplaceCore
        children(first: $secondService, offset: $offsetSecondService) {
          ...WorkplaceCore
          individuals (first: $secondIndividual, offset: $offsetSecondIndividual) {
            ...IndividualCore
          }
          children (first: $thirdService, offset: $offsetThirdService) {
            ...WorkplaceCore
            individuals (first: $thirdIndividual, offset: $offsetThirdIndividual) {
              ...IndividualCore
            }
          }
        }
        individuals(first: $firstIndividual, offset: $offsetFirstIndividual) {
          ...IndividualCore
        }
      }
    }
  }
  ${FRAGMENT_WORKPLACE_CORE}
  ${FRAGMENT_INDIVIDUAL_CORE}
`;

export default function workplacesByID(variables: WorkplaceByIdQueryVariables, config?): Promise<WorkplaceByIdQuery> {
  return graphqlClient(QUERY_WORKPLACE_BY_ID, variables, config);
}

export function servicesByWorkplacesID(variables: ServicesByWorkplaceIdVariables, config?): Promise<ServiceWorkplaceByIdQuery> {
  return graphqlClient(QUERY_SERVICES_BY_WORKPLACE_BY_ID, variables, config);
}
