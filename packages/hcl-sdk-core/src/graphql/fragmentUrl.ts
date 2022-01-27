import { gql } from 'graphql-request'

export const FRAGMENT_URL = gql`
  fragment Url on Url {
    doctolib {
      webcrawled
      generated
    }
    arzttermine {
      webcrawled
      generated
    }
    maiia {
      webcrawled
      generated
    }
  }
`
