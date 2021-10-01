
module.exports = {

  up: async (queryInterface: any, Sequelize: any) => 
  {
    await queryInterface.createTable('messages', 
    {
      id: 
      { 
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      from: 
      { 
        type: Sequelize.UUID,
        allowNull: false
      },
      to: 
      { 
        type: Sequelize.UUID,
        allowNull: false
      },
      content:  
      { 
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('messages');
  }
};