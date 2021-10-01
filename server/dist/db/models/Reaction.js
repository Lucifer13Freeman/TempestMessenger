"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Reaction extends Model {
        static associate({ User, Message }) {
            this.belongsTo(Message, { foreignKey: { name: 'message_id',
                    allowNull: false } });
            this.belongsTo(User, { foreignKey: { name: 'user_id',
                    allowNull: false } });
        }
    }
    ;
    Reaction.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        message_id: {
            type: DataTypes.UUID,
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
        modelName: 'Reaction',
        tableName: 'reactions',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
    return Reaction;
};
