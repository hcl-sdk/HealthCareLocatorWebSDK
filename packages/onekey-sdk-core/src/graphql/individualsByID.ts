import { gql } from 'graphql-request';
import { graphqlClient } from './helpers'
import { IndividualWorkPlaceDetails, QueryIndividualByIdArgs } from './types';

interface IndividualsByIDResult {
  individualByID: IndividualWorkPlaceDetails
}

const QUERY_INDIVIDUAL_BY_ID = gql`
  query individualByID($id: ID!) {
    individualByID(
      id: $id
    ) {
      id
      firstName
      lastName
      specialties {
        label
      }
      mailingName
      title
      professionalType {
        label
      }
      webAddress
      mainActivity {
        workplace {
          name
          localPhone
          intlFax
          webAddress
          address {
            postalCode
            longLabel
            county {
              label
            }
            country
            city {
              label
            }
          }
        }
      }
    }
  }
`

export default function individualsByID(variables: QueryIndividualByIdArgs): Promise<IndividualsByIDResult> {
  return graphqlClient(QUERY_INDIVIDUAL_BY_ID, variables)
}