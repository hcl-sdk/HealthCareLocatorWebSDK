import { gql } from 'graphql-request';
import { FRAGMENT_WORKPLACE_CORE } from './fragmentWorkplace';
import { graphqlClient } from './helpers';
import { WorkplaceByIdv2Query, WorkplaceByIdv2QueryVariables } from './types';

const QUERY_WORKPLACE_BY_ID_V2 = gql`
  query workplaceByIDV2($id: ID!, $locale: String) {
    workplaceByIDV2(id: $id, locale: $locale) {
      ...WorkplaceCore
      individuals {
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
              generated
            }
          }
        }
        specialties {
          code
          label
        }
      }
    }
  }
  ${FRAGMENT_WORKPLACE_CORE}
`;

export default function workplacesByIDV2(variables: WorkplaceByIdv2QueryVariables, config?): Promise<WorkplaceByIdv2Query> {
  return graphqlClient(QUERY_WORKPLACE_BY_ID_V2, variables, config);
}
