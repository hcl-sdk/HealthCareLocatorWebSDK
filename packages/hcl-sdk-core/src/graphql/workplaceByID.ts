import { gql } from 'graphql-request';
import { FRAGMENT_URL } from './fragmentUrl';
import { FRAGMENT_WORKPLACE_CORE } from './fragmentWorkplace';
import { graphqlClient } from './helpers';
import { WorkplaceByIdQuery, WorkplaceByIdQueryVariables } from './types';

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

export default function workplacesByID(variables: WorkplaceByIdQueryVariables, config?): Promise<WorkplaceByIdQuery> {
  return graphqlClient(QUERY_WORKPLACE_BY_ID, variables, config);
}
