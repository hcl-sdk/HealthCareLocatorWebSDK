import { gql } from 'graphql-request';
import { graphqlClient } from './helpers'
import { Activity, QueryActivityByIdArgs } from './types';

interface ActivityByIdResult {
  activityByID: Activity
}

const QUERY_ACTIVITY_BY_ID = gql`
  query activityById($id: ID!) {
    activityByID(
      id: $id
    ) {
      id
      phone
      role{
        code
        label
      }
      fax
      webAddress
      workplace{
        id
        name
        address{
          id
          longLabel
          country
          postalCode
          buildingLabel
          county{
              label
          }
          city{
              label
          }
          location{
            lat
            lon
          }
        }
      }
      individual{
        id
        firstName
        lastName
        middleName
        mailingName
        middleName
        nickname
        suffixName
        professionalType { label }
        specialties {
          code
          label
        }
        mainActivity {
          id
          workplace {
            address {
              longLabel
            }
          }
        }
        otherActivities {
          id
          workplace {
            address {
              longLabel
            }
          }
        }
      }
    }
  }
`

export default function activityByID(variables: QueryActivityByIdArgs, config?): Promise<ActivityByIdResult> {
  return graphqlClient(QUERY_ACTIVITY_BY_ID, variables, config)
}