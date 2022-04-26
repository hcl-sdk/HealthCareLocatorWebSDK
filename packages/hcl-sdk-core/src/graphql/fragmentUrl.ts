import { gql } from 'graphql-request'

export const FRAGMENT_URL = gql`
  fragment Url on UrlDetail {
    generated
    webcrawled
  }
`;
