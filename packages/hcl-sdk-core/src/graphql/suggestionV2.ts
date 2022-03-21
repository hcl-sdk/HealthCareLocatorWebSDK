import { gql } from 'graphql-request';
import { graphqlClient } from './helpers';
import { SuggestionsV2Query, SuggestionsV2QueryVariables } from './types';

const QUERY_SUGGEST = gql`
  query suggestionsV2($criteria: String, $country: String, $location: GeopointQuery, $locale: String, $first: Int, $scope: SuggestionScope) {
    suggestionsV2(first: $first, criteria: $criteria, country: $country, location: $location, locale: $locale, scope: $scope) {
      edges {
        node {
          workplace {
            id
            name
            type {
              label
            }
          }
          address {
            longLabel
            postalCode
            city {
              label
            }
          }
        }
      }
    }
  }
`;

export default function suggest(variables: SuggestionsV2QueryVariables, config?): Promise<SuggestionsV2Query> {
  return graphqlClient(QUERY_SUGGEST, variables, config);
}
