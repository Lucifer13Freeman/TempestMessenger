"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Message, User, Reaction } = require('../../db/models');
const { UserInputError, AuthenticationError, ForbiddenError, withFilter } = require('apollo-server');
const { Op } = require('sequelize');
module.exports = {
    Query: {
        get_messages: async (parent, { from }, { user }) => {
            try {
                if (!user)
                    throw new AuthenticationError('Unauthenticated');
                const other_user = await User.findOne({ where: { id: from } });
                if (!other_user)
                    throw new UserInputError('User not found');
                const ids = [user.id, other_user.id];
                let messages = await Message.findAll({
                    where: {
                        from: { [Op.in]: ids },
                        to: { [Op.in]: ids }
                    },
                    order: [['created_at', 'DESC']],
                    include: [{ model: Reaction, as: 'reactions' }]
                });
                return messages;
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        }
    },
    Mutation: {
        send_message: async (parent, { to, content }, { user, pubsub }) => {
            try {
                if (!user)
                    throw new AuthenticationError('Unauthenticated');
                const recipient = await User.findOne({ where: { id: to } });
                if (!recipient)
                    throw new UserInputError('User not found');
                else if (recipient.id === user.id)
                    throw new UserInputError(`You can't message yourself`);
                if (content.trim() === '')
                    throw new UserInputError('Message is empty');
                const message = await Message.create({
                    from: user.id,
                    to,
                    content
                });
                pubsub.publish('NEW_MESSAGE', { new_message: message });
                return message;
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        },
        react_to_message: async (_, { id, content }, { pubsub, user }) => {
            const reactions = ['❤️', '😆', '😯', '😢', '😡', '👍', '👎'];
            try {
                if (!reactions.includes(content))
                    throw new UserInputError('Invalid reaction');
                const user_id = user ? user.id : '';
                user = await User.findOne({ where: { id: user_id } });
                if (!user)
                    throw new AuthenticationError('Unauthenticated');
                const message = await Message.findOne({ where: { id } });
                if (!message)
                    throw new UserInputError('Message not found');
                if (message.from !== user.id && message.to !== user.id)
                    throw new ForbiddenError('Unauthorized');
                let reaction = await Reaction.findOne({
                    where: {
                        user_id: user.id,
                        message_id: message.id
                    }
                });
                if (reaction) {
                    reaction.content = content;
                    await reaction.save();
                }
                else {
                    reaction = await Reaction.create({
                        user_id: user.id,
                        message_id: message.id,
                        content
                    });
                }
                pubsub.publish('NEW_REACTION', { new_reaction: reaction });
                return reaction;
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        }
    },
    Subscription: {
        new_message: {
            subscribe: withFilter((_, __, { pubsub, user }) => {
                if (!user)
                    throw new AuthenticationError('Unauthenticated');
                return pubsub.asyncIterator('NEW_MESSAGE');
            }, ({ new_message }, _, { user }) => {
                if (new_message.from === user.id || new_message.to === user.id)
                    return true;
                else
                    return false;
            })
        },
        new_reaction: {
            subscribe: withFilter((_, __, { pubsub, user }) => {
                if (!user)
                    throw new AuthenticationError('Unauthenticated');
                return pubsub.asyncIterator('NEW_REACTION');
            }, async ({ new_reaction }, _, { user }) => {
                const message = await new_reaction.getMessage();
                if (message.from === user.id || message.to === user.id)
                    return true;
                else
                    return false;
            })
        }
    }
};
