"use strict";
require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const resolvers = require('./graphql/resolvers');
const typeDefs = require('./graphql/typeDefs');
const { sequelize } = require('./db/models');
const context_middleware = require('./middleware/context_middleware');
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: context_middleware,
});
const start = async () => {
    try {
        await sequelize
            .authenticate()
            .then(() => console.log('Database connected!'))
            .catch((e) => console.log(e));
        await sequelize.sync({ alter: true });
        server.listen().then(({ url }) => {
            console.log(`🚀 Server ready at ${url}`);
        });
    }
    catch (e) {
        console.log(e);
    }
};
start();
