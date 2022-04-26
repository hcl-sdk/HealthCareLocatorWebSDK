import { gql } from 'graphql-request';
import { graphqlClient } from './helpers'
import { IndividualByIdQuery, IndividualByIdQueryVariables } from './types';

const QUERY_INDIVIDUAL_BY_ID = gql`
  query individualByID($id: ID!, $locale: String) {
    individualByID(
      id: $id
      locale: $locale
    ) {
      id
      firstName
      lastName
      middleName
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

export default function individualsByID(variables: IndividualByIdQueryVariables, config?): Promise<IndividualByIdQuery> {
  return graphqlClient(QUERY_INDIVIDUAL_BY_ID, variables, config)
}