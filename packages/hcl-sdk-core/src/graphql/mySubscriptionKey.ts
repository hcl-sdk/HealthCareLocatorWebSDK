import { gql } from 'graphql-request';
import { graphqlClient } from './helpers'
import { SubscriptionKey } from './types';

interface SubscriptionKeyResult {
  mySubscriptionKey: SubscriptionKey
}

const QUERY_MY_SUBSCRIPTION_KEY = gql`
  query mySubscriptionKey {
    mySubscriptionKey {
      countries
    }
  }
`

export default function mySubscriptionKey(config): Promise<SubscriptionKeyResult> {
  return graphqlClient(QUERY_MY_SUBSCRIPTION_KEY, null, config)
}