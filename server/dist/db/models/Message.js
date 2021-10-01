"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Message extends Model {
        static associate({ Reaction }) {
            this.hasMany(Reaction, { as: 'reactions', foreignKey: 'message_id' });
        }
    }
    Message.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        from: {
            type: DataTypes.UUID,
            allowNull: false
        },
        to: {
            type: DataTypes.UUID,
            allowNull: false
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false
        },
        created_at: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: new Date()
        },
        updated_at: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: new Date()
        }
    }, {
        sequelize,
        modelName: 'Message',
        tableName: 'messages',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
    return Message;
};
