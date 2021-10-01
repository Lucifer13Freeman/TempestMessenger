export{};
const { Message, User, Reaction } = require('../../db/models');
const { UserInputError, 
        AuthenticationError, 
        ForbiddenError,
        withFilter } = require('apollo-server');
const { Op } = require('sequelize');


module.exports = {
    
    Query:
    {
        get_messages: async (parent: any, { from }: any, { user }: any) => 
        {
            try 
            {
                if (!user) throw new AuthenticationError('Unauthenticated');

                const other_user = await User.findOne({ where: { id: from } });

                if (!other_user) throw new UserInputError('User not found');

                const ids: Array<string> = [user.id, other_user.id];

                let messages = await Message.findAll(
                {
                    where: 
                    {
                        from: { [Op.in]: ids },
                        to: { [Op.in]: ids }
                    },
                    order: [['created_at', 'DESC']],
                    include: [{ model: Reaction, as: 'reactions' }]
                });
                
                return messages;
            }
            catch (err) 
            {
                console.log(err);
                throw err;
            }
        }
    },
    Mutation:
    {
        send_message: async (parent: any, { to, content }: any, { user, pubsub }: any) => 
        {
            try 
            {
                if (!user) throw new AuthenticationError('Unauthenticated');

                const recipient = await User.findOne({ where: { id: to } });

                if (!recipient) 
                    throw new UserInputError('User not found');
                else if (recipient.id === user.id) 
                    throw new UserInputError(`You can't message yourself`);

                if (content.trim() === '') throw new UserInputError('Message is empty');

                const message = await Message.create(
                {
                    from: user.id,
                    to,
                    content
                });

                pubsub.publish('NEW_MESSAGE', { new_message: message });

                return message;
            } 
            catch (err) 
            {
                console.log(err);
                throw err;
            }
        },
        react_to_message: async (_: any, { id, content }: any, { pubsub, user }: any) =>
        {
            const reactions = ['❤️', '😆', '😯', '😢', '😡', '👍', '👎'];

            try 
            {
                if (!reactions.includes(content)) 
                    throw new UserInputError('Invalid reaction');

                const user_id = user ? user.id : '';

                user = await User.findOne({ where: { id: user_id } });
                if (!user) throw new AuthenticationError('Unauthenticated');

                const message = await Message.findOne({ where: { id } });
                if (!message) throw new UserInputError('Message not found');

                if (message.from !== user.id && message.to !== user.id) 
                    throw new ForbiddenError('Unauthorized');

                let reaction = await Reaction.findOne(
                {
                    where: { 
                        user_id: user.id,
                        message_id: message.id
                    }
                });

                if (reaction) 
                {
                    reaction.content = content;
                    await reaction.save();
                }
                else
                {
                    reaction = await Reaction.create(
                    {
                        user_id: user.id,
                        message_id: message.id,
                        content
                    });
                }

                pubsub.publish('NEW_REACTION', { new_reaction: reaction });

                return reaction;
            }
            catch (err) 
            {
                console.log(err);
                throw err;
            }
        }
    },
    Subscription:
    {
        new_message: 
        {
            subscribe: withFilter((_: any, __: any, { pubsub, user }: any) => 
            {
                if (!user) throw new AuthenticationError('Unauthenticated');
                return pubsub.asyncIterator('NEW_MESSAGE');
            }, 
            ({ new_message }: any, _: any, { user }: any) =>
            {
                if (new_message.from === user.id || new_message.to === user.id) return true;
                else return false;
            })
        },
        new_reaction: 
        {
            subscribe: withFilter((_: any, __: any, { pubsub, user }: any) => 
            {
                if (!user) throw new AuthenticationError('Unauthenticated');
                return pubsub.asyncIterator('NEW_REACTION');
            }, 
            async ({ new_reaction }: any, _: any, { user }: any) =>
            {
                const message = await new_reaction.getMessage();

                if (message.from === user.id || message.to === user.id) return true;
                else return false;
            })
        }
    }
}