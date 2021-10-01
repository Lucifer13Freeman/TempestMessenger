"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('messages', [
            {
                id: '0d04147d-60be-45bf-93f0-4fd1a9340100',
                from: '0d04147d-60be-45bf-93f0-4fd1a9340000',
                to: '0d04147d-60be-45bf-93f0-4fd1a9340001',
                content: 'test message 0-1',
                created_at: new Date(new Date().setHours(new Date().getHours() - 10)),
                updated_at: new Date(new Date().setHours(new Date().getHours() - 10)),
            },
            {
                id: '0d04147d-60be-45bf-93f0-4fd1a9340101',
                from: '0d04147d-60be-45bf-93f0-4fd1a9340000',
                to: '0d04147d-60be-45bf-93f0-4fd1a9340002',
                content: 'test message 0-2',
                created_at: new Date(new Date().setHours(new Date().getHours() - 9)),
                updated_at: new Date(new Date().setHours(new Date().getHours() - 9)),
            },
            {
                id: '0d04147d-60be-45bf-93f0-4fd1a9340102',
                from: '0d04147d-60be-45bf-93f0-4fd1a9340000',
                to: '0d04147d-60be-45bf-93f0-4fd1a9340003',
                content: 'test message 0-3',
                created_at: new Date(new Date().setHours(new Date().getHours() - 8)),
                updated_at: new Date(new Date().setHours(new Date().getHours() - 8)),
            },
            {
                id: '0d04147d-60be-45bf-93f0-4fd1a9340103',
                from: '0d04147d-60be-45bf-93f0-4fd1a9340001',
                to: '0d04147d-60be-45bf-93f0-4fd1a9340000',
                content: 'test message 1-0',
                created_at: new Date(new Date().setHours(new Date().getHours() - 7)),
                updated_at: new Date(new Date().setHours(new Date().getHours() - 7)),
            },
            {
                id: '0d04147d-60be-45bf-93f0-4fd1a9340104',
                from: '0d04147d-60be-45bf-93f0-4fd1a9340001',
                to: '0d04147d-60be-45bf-93f0-4fd1a9340002',
                content: 'test message 1-2',
                created_at: new Date(new Date().setHours(new Date().getHours() - 6)),
                updated_at: new Date(new Date().setHours(new Date().getHours() - 6)),
            },
            {
                id: '0d04147d-60be-45bf-93f0-4fd1a9340105',
                from: '0d04147d-60be-45bf-93f0-4fd1a9340002',
                to: '0d04147d-60be-45bf-93f0-4fd1a9340001',
                content: 'test message 2-1',
                created_at: new Date(new Date().setHours(new Date().getHours() - 5)),
                updated_at: new Date(new Date().setHours(new Date().getHours() - 5)),
            },
            {
                id: '0d04147d-60be-45bf-93f0-4fd1a9340106',
                from: '0d04147d-60be-45bf-93f0-4fd1a9340002',
                to: '0d04147d-60be-45bf-93f0-4fd1a9340000',
                content: 'test message 2-0',
                created_at: new Date(new Date().setHours(new Date().getHours() - 4)),
                updated_at: new Date(new Date().setHours(new Date().getHours() - 4)),
            },
            {
                id: '0d04147d-60be-45bf-93f0-4fd1a9340107',
                from: '0d04147d-60be-45bf-93f0-4fd1a9340002',
                to: '0d04147d-60be-45bf-93f0-4fd1a9340003',
                content: 'test message 2-3',
                created_at: new Date(new Date().setHours(new Date().getHours() - 3)),
                updated_at: new Date(new Date().setHours(new Date().getHours() - 3)),
            },
            {
                id: '0d04147d-60be-45bf-93f0-4fd1a9340108',
                from: '0d04147d-60be-45bf-93f0-4fd1a9340003',
                to: '0d04147d-60be-45bf-93f0-4fd1a9340002',
                content: 'test message 3-2',
                created_at: new Date(new Date().setHours(new Date().getHours() - 2)),
                updated_at: new Date(new Date().setHours(new Date().getHours() - 2)),
            },
            {
                id: '0d04147d-60be-45bf-93f0-4fd1a9340109',
                from: '0d04147d-60be-45bf-93f0-4fd1a9340003',
                to: '0d04147d-60be-45bf-93f0-4fd1a9340000',
                content: 'test message 3-0',
                created_at: new Date(new Date().setHours(new Date().getHours() - 1)),
                updated_at: new Date(new Date().setHours(new Date().getHours() - 1)),
            }
        ], {});
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('messages', null, {});
    }
};
