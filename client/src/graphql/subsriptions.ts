import { gql } from '@apollo/client';


const NEW_MESSAGE = gql`
  subscription new_message {
    new_message {
      id
      from
      to
      content
      created_at
      updated_at
    }
  }
`;

const NEW_REACTION = gql`
  subscription new_reaction {
    new_reaction {
      id
      content
      created_at
      updated_at
      message {
        id
        from 
        to
      }
    }
  }
`;


export {
    NEW_MESSAGE,
    NEW_REACTION
}