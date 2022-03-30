import { gql } from 'graphql-request';
import { FRAGMENT_URL } from './fragmentUrl';
import { FRAGMENT_WORKPLACE_CORE } from './fragmentWorkplace';
import { graphqlClient } from './helpers';
import { WorkplaceByIdv2Query, WorkplaceByIdv2QueryVariables } from './types';

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

const QUERY_WORKPLACE_BY_ID_V2 = gql`
  query workplaceByIDV2($id: ID!, $locale: String) {
    workplaceByIDV2(id: $id, locale: $locale) {
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

export default function workplacesByIDV2(variables: WorkplaceByIdv2QueryVariables, config?): Promise<WorkplaceByIdv2Query> {
  return graphqlClient(QUERY_WORKPLACE_BY_ID_V2, variables, config);
}
