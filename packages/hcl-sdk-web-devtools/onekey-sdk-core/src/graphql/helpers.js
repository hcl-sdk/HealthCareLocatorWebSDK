import { GraphQLClient } from 'graphql-request';
import { ENDPOINT } from './constants';
export function graphqlClient(query, variables, config = {}) {
  const client = new GraphQLClient(ENDPOINT, {
    mode: 'no-cors',
    headers: Object.assign({}, config.headers)
  });
  return client.request(query, variables);
}
