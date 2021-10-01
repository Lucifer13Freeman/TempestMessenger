import { gql } from '@apollo/client';


const REGISTER_USER = gql`
  mutation register(
        $name: String!
        $surname: String!
        $patronymic: String
        $email: String!
        $password: String!
        $confirm_password: String!
    ) 
    {
        register(
            name: $name
            surname: $surname
            patronymic: $patronymic
            email: $email
            password: $password
            confirm_password: $confirm_password
        ) 
        {
            name
            surname
            patronymic
            email
            created_at
        }
    }
`;

const SEND_MESSAGE = gql`
  mutation send_message($to: String!, $content: String!) {
    send_message(to: $to, content: $content) {
      id 
      from 
      to 
      content 
      created_at
      updated_at
    }
  }
`;

const REACT_TO_MESSAGE = gql`
    mutation react_to_message($id: String! $content: String!) {
        react_to_message(id: $id content: $content) {
            id
        }
    }
`;


export {
    REGISTER_USER,
    SEND_MESSAGE,
    REACT_TO_MESSAGE
}