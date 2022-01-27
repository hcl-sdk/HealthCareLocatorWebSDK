import { gql } from 'graphql-request';
import { graphqlClient } from './helpers'
import { Activity, QueryActivityByIdArgs } from './types';
import { FRAGMENT_URL } from './fragmentUrl'

interface ActivityByIdResult {
  activityByID: Activity
}

const QUERY_ACTIVITY_BY_ID = gql`
  query activityById($id: ID!, $locale: String) {
    activityByID(id: $id, locale: $locale) {
      id
      phone
      url {
        ...Url
      }
      role {
        code
        label
      }
      fax
      webAddress
      workplace {
        id
        name
        intlPhone
        intlFax
        localPhone
        openHours {
          day
          openPeriods {
            open
            close
          }
        }
        address {
          longLabel
          country
          postalCode
          buildingLabel
          county {
            label
          }
          city {
            label
          }
          location {
            lat
            lon
          }
        }
      }
      individual {
        id
        firstName
        lastName
        middleName
        mailingName
        middleName
        nickname
        suffixName
        professionalType {
          label
        }
        specialties {
          code
          label
        }
        mainActivity {
          id
          workplace {
            address {
              longLabel
              postalCode
              buildingLabel
              city {
                code
                label
              }
            }
          }
        }
        otherActivities {
          id
          workplace {
            address {
              longLabel
              postalCode
              buildingLabel
              city {
                code
                label
              }
            }
          }
        }
        meshTerms
        kvTerms
        chTerms
        uci {
          rpps
          adeli
        }
        reviewsAvailable
        diseasesAvailable
      }
    }
  }
  ${FRAGMENT_URL}
`

export default function activityByID(variables: QueryActivityByIdArgs, config?): Promise<ActivityByIdResult> {
  return graphqlClient(QUERY_ACTIVITY_BY_ID, variables, config)
}
