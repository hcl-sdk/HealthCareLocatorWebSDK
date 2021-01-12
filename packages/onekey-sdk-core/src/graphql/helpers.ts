import { GraphQLClient } from 'graphql-request';
import { ENDPOINT } from './constants'

export function graphqlClient(query, variables) {
  const client = new GraphQLClient(ENDPOINT, { 
    mode: 'no-cors',
    headers: {
      'Ocp-Apim-Subscription-Key': '300002938e8ed9e6'
    }
  });
  return client.request(query, variables);
}