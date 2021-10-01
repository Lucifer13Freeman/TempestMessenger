import { gql } from '@apollo/client';


const LOGIN_USER = gql`
  query login(
        $email: String!
        $password: String!
    ) {
        login(
            email: $email
            password: $password
        ) {
            name
            surname
            patronymic
            email
            created_at
            token
        }
    }
`;

const GET_USERS = gql`
  query get_users {
    get_users {
      id
      name
      surname
      patronymic
      image
      created_at
      latest_message {
        id 
        from 
        to 
        content 
        created_at
      }
    }
  }
`;

const GET_MESSAGES = gql`
  query get_messages($from: String!) {
    get_messages(from: $from) {
      id
      from 
      to 
      content 
      created_at 
      updated_at
      reactions {
        id
        content
      }
    }
  }
`;


export {
    LOGIN_USER,
    GET_USERS,
    GET_MESSAGES
}