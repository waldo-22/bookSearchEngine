import { gql } from '@apollo/client';

export const GET_ME = gql`
  query me($userId: ID!) {
    user(userId: $userId) {
      _id
      username
      email
      savedBooks {
        _id
        authors
        description
        bookId
        image
        link
        title
      }
    }
  }
`;

