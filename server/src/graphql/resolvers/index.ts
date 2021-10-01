const user_resolvers = require('./users');
const message_resolvers = require('./messages');
const { Message, User, Reaction } = require('../../db/models');


module.exports = {

    User: 
    {
        created_at: (parent: any) => parent.created_at?.toISOString(),
        updated_at: (parent: any) => parent.updated_at?.toISOString()
    },
    Message: 
    {
        created_at: (parent: any) => parent.created_at.toISOString(),
        updated_at: (parent: any) => parent.updated_at.toISOString()
    },
    Reaction:
    {
        created_at: (parent: any) => parent.created_at?.toISOString(),
        updated_at: (parent: any) => parent.updated_at?.toISOString(),
        message: async (parent: any) => await Message.findByPk(parent.message_id),
        user: async (parent: any) => await User.findByPk(parent.user_id, 
            { attributes: [
                'id',
                'surname',
                'name',
                'patronymic',
                'image',
                'created_at', 
                'updated_at' 
            ]})
    },
    Query: 
    {
        ...user_resolvers.Query,
        ...message_resolvers.Query
    },
    Mutation: 
    {
        ...user_resolvers.Mutation,
        ...message_resolvers.Mutation
    },
    Subscription:
    {
        ...message_resolvers.Subscription
    }
}