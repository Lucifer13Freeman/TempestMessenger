require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const resolvers = require('./graphql/resolvers');
const typeDefs = require('./graphql/typeDefs');
const { sequelize } = require('./db/models');
const context_middleware = require('./middleware/context_middleware');


const server = new ApolloServer(
{ 
    typeDefs, 
    resolvers,
    context: context_middleware,
    //subscriptions: { path: '/' },
});


const start = async () => {

    try
    {
        await sequelize
                .authenticate()
                .then(() => console.log('Database connected!'))
                .catch((e: any) => console.log(e));
        
        await sequelize.sync({ alter: true });

        server.listen().then(({ url }: any)/*(server: any)*/ => 
        {
            console.log(`🚀 Server ready at ${url /*server.url*/}`);
            //console.log(`🚀 Subscriptions ready at ${server.subscriptionsUrl}`)
        });
    }
    catch (e)
    {
        console.log(e);
    }
}

start();