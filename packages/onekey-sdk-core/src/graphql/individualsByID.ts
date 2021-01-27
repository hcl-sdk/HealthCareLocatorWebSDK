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
      title {
        code
        label
      }
      professionalType {
        label
      }
      webAddress
      mainActivity {
        phone
        fax
        title {
          code
          label
        }
        workplace {
          name
          localPhone
          intlFax
          webAddress
          address {
            postalCode
            longLabel
            buildingLabel
            county {
              code
              label
            }
            country
            city {
              code
              label
            }
          }
        }
      }
      otherActivities {
        phone
        fax
        title {
          code
          label
        }
        workplace {
          name
          localPhone
          intlFax
          webAddress
          address {
            postalCode
            longLabel
            buildingLabel
            county {
              code
              label
            }
            country
            city {
              code
              label
            }
          }
        }
      }
    }
  }
`

export default function individualsByID(variables: QueryIndividualByIdArgs, config?): Promise<IndividualsByIDResult> {
  return graphqlClient(QUERY_INDIVIDUAL_BY_ID, variables, config)
}