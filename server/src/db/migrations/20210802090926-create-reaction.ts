
module.exports = {

  up: async (queryInterface: any, Sequelize: any) => 
  {
    await queryInterface.createTable('reactions', 
    {
      id: 
      {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      content: 
      {
        type: Sequelize.STRING,
        allowNull: false
      },
      user_id:
      {
        type: Sequelize.UUID,
        allowNull: false
      },
      message_id:
      {
        type: Sequelize.UUID,
        allowNull: false
      },
      created_at: 
      {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updated_at: 
      {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      }
    });
  },
  down: async (queryInterface: any, Sequelize: any) => 
  {
    await queryInterface.dropTable('reactions');
  }
};