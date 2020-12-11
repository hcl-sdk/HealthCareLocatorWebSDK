import { GraphQLClient } from 'graphql-request';
import { ENDPOINT } from './constants'

export function graphqlClient(query, variables) {
  const client = new GraphQLClient(ENDPOINT, { mode: 'no-cors' });
  return client.request(query, variables);
}