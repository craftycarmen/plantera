'use strict';

const { Order } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const ordersList = [
  {
    buyerId: 1,
    cartId: 1,
    address: '123 Test St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94016',
    paymentMethod: 'VIZZA',
    paymentDetails: '1234',
    orderTotal: 21.65
  },
  {
    buyerId: 3,
    cartId: 2,
    address: '456 Third St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    paymentMethod: 'Americano Expresso',
    paymentDetails: '0000',
    orderTotal: 86.66
  },
]


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await Order.bulkCreate(ordersList, { validate: true })
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Orders';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, { [Op.or]: ordersList }, {})
  }
};
