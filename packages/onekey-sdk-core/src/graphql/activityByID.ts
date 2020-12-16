import { gql } from 'graphql-request';
import { graphqlClient } from './helpers'
import { Activity, QueryActivityByIdArgs } from './types';

interface ActivityByIdResult {
  activityByID: Activity
}

const QUERY_ACTIVITY_BY_ID = gql`
  query activityById($apiKey: String!, $id: ID!) {
    activityByID(
      apiKey: $apiKey
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
          localPhone
          emailAddress
          address{
            id
            longLabel
            country
            postalCode
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
        specialties{
          code
          label
        }
      }
    }
  }
`

export default function activityByID(variables: QueryActivityByIdArgs): Promise<ActivityByIdResult> {
  return graphqlClient(QUERY_ACTIVITY_BY_ID, variables)
}