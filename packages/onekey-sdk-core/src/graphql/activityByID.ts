import { gql } from 'graphql-request';
import { graphqlClient } from './helpers'
import { ActivityResult, QueryActivityByIdArgs } from './types';

interface ActivityByIdResult {
  activityById: ActivityResult
}

const QUERY_ACTIVITY_BY_ID = gql`
  query activityById($apiKey: String!, $id: String!) {
    activityByID(
      apiKey: $apiKey
      id: $activityById
    ) {
      id
      workplace {
        name
        address {
          longLabel
        }
      }
    }
  }
`

export default function activityByID(variables: QueryActivityByIdArgs): Promise<ActivityByIdResult> {
  return graphqlClient(QUERY_ACTIVITY_BY_ID, variables)
}