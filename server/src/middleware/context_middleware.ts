export {};
const jwt = require('jsonwebtoken');
const { PubSub } = require('apollo-server');


const pubsub = new PubSub();

module.exports = (context: any) =>
{
    let token;

    if (context.req && context.req.headers.authorization)
    {
        token = context.req.headers.authorization.split('Bearer ')[1];
    }
    else if (context.connection && context.connection.context.Authorization)
    {
        token = context.connection.context.Authorization.split('Bearer ')[1];
    }

    if (token) jwt.verify(token, process.env.JWT_SECRET, 
    (err: any, decoded_token: any) =>
    {
        context.user = decoded_token;
    });

    context.pubsub = pubsub;

    return context;
}