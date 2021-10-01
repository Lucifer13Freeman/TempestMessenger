const argon2 = require('argon2');


module.exports = {

  up: async (queryInterface: any, Sequelize: any) => 
  {
    const password = 'test';

    await queryInterface.bulkInsert('users', 
    [
      {
        id: '0d04147d-60be-45bf-93f0-4fd1a9340000',
        name: 'test',
        surname: 'testov',
        patronymic: 'testovich',
        email: 'test@mail.com',
        image: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
        password: await argon2.hash(password),
        role: 'USER',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '0d04147d-60be-45bf-93f0-4fd1a9340001',
        name: 'test1',
        surname: 'testov1',
        patronymic: 'testovich1',
        email: 'test1@mail.com',
        image: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
        password: await argon2.hash(password),
        role: 'USER',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '0d04147d-60be-45bf-93f0-4fd1a9340002',
        name: 'test2',
        surname: 'testov2',
        patronymic: 'testovich2',
        email: 'test2@mail.com',
        image: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
        password: await argon2.hash(password),
        role: 'USER',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '0d04147d-60be-45bf-93f0-4fd1a9340003',
        name: 'test3',
        surname: 'testov3',
        patronymic: 'testovich3',
        email: 'test3@mail.com',
        image: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
        password: await argon2.hash(password),
        role: 'USER',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface: any, Sequelize: any) => 
  {
    await queryInterface.bulkDelete('users', null, {});
  }
};
