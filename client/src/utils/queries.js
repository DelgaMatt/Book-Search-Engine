import { gql } from 'apollo-server-express';

export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        title
        description
        image
        link
      }
    }
  }
`;