'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      buyerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'cascade'
      },
      cartId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'ShoppingCarts',
          key: 'id'
        },
      },
      firstName: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      address: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING(2),
        allowNull: false,
      },
      zipCode: {
        type: Sequelize.STRING(5),
        allowNull: false,
      },
      stripePaymentIntentId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      paymentStatus: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "Pending",
      },
      transactionDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      // paymentMethod: {
      //   type: Sequelize.STRING(25),
      //   allowNull: false,
      // },
      // paymentDetails: {
      //   type: Sequelize.STRING(4),
      //   allowNull: false,
      // },
      subTotal: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      orderTotal: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Orders";
    await queryInterface.dropTable(options);
  }
};
