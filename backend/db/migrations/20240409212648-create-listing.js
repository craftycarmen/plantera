'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Listings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sellerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'cascade'
      },
      guideId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Guides',
          key: 'id'
        }
      },
      plantName: {
        type: Sequelize.STRING(100)
      },
      description: {
        type: Sequelize.STRING(250)
      },
      price: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      potSize: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      stockQty: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Listings');
  }
};
