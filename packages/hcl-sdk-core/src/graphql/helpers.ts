import { GraphQLClient } from 'graphql-request';
import { ENDPOINT } from './constants'
import * as Dom from 'graphql-request/dist/types.dom';

const VERSION = 'v2'

export function graphqlClient(query, variables, config: Partial<Dom.RequestInit> = {}) {
  const client = new GraphQLClient(ENDPOINT + `/${VERSION}/query`, { 
    mode: 'no-cors',
    headers: {
      ...config.headers
    }
  });
  return client.request(query, variables);
}