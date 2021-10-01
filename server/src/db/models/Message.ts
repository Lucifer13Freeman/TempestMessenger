export {};
const { Model } = require('sequelize');

module.exports = (sequelize: any, DataTypes: any) => 
{
  class Message extends Model 
  {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Reaction }: any) 
    {
      // define association here
      this.hasMany(Reaction, { as: 'reactions', foreignKey: 'message_id' });
    }
  }

  Message.init(
  {
    id: 
    { 
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    from: 
    { 
      type: DataTypes.UUID,
      allowNull: false
    },
    to: 
    { 
      type: DataTypes.UUID,
      allowNull: false
    },
    content:  
    { 
      type: DataTypes.STRING,
      allowNull: false
    },
    created_at: 
    {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    updated_at: 
    {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date()
    }
  }, 
  {
    sequelize,
    modelName: 'Message',
    tableName: 'messages',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return Message;
}