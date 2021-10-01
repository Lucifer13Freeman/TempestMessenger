"use strict";
const { gql } = require('apollo-server');
module.exports = gql `
  
    type User {
        
        id: String!
        name: String!
        surname: String!
        patronymic: String
        email: String
        image: String
        role: String
        created_at: String
        updated_at: String
        token: String
        latest_message: Message
    }

    type Message {

        id: String!
        to: String!
        from: String!
        content: String!
        created_at: String!
        updated_at: String!
        reactions: [Reaction]
    }

    type Reaction {

        id: String!
        content: String!
        user: User!
        message: Message!
        created_at: String!
        updated_at: String!
    }

    type Query {

        get_users: [User]!
        login(email: String!, password: String!): User!
        get_messages(from: String!): [Message]!
    }

    type Mutation {

        register(
            name: String!
            surname: String!
            patronymic: String
            email: String!
            password: String!
            confirm_password: String!
        ): User!

        send_message(
            to: String!
            content: String!
        ): Message!

        react_to_message(
            id: String! 
            content: String!
        ): Reaction!
    }

    type Subscription {

        new_message: Message!
        new_reaction: Reaction!
    }
`;
