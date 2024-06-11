'use strict';

const { Order } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const ordersList = [
  {
    buyerId: 2,
    orderId: 1,
    firstName: "Ellie",
    lastName: "Bellie",
    address: '555 Mission Blvd',
    city: "San Francisco",
    state: "CA",
    zipCode: '94107',
    paymentMethod: 'VIZZA',
    paymentDetails: '1234',
    subTotal: 15.00,
    orderTotal: 16.24
  },
  {
    buyerId: 3,
    orderId: 2,
    firstName: 'Kingston',
    lastName: 'Shmingston',
    address: '456 Third St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    paymentMethod: 'Americano Expresso',
    paymentDetails: '0000',
    subTotal: 130.00,
    orderTotal: 140.73
  },
  {
    buyerId: 10,
    orderId: 3,
    firstName: 'Alice',
    lastName: 'Greenfield',
    address: '456 Fifth St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    paymentMethod: 'Americano Expresso',
    paymentDetails: '0000',
    subTotal: 85.00,
    orderTotal: 92.01
  },
  {
    buyerId: 1,
    orderId: 4,
    firstName: "Ellie",
    lastName: "Bellie",
    address: '555 Mission Blvd',
    city: "San Francisco",
    state: "CA",
    zipCode: '94107',
    paymentMethod: 'Americano Expresso',
    paymentDetails: '0000',
    subTotal: 128.00,
    orderTotal: 138.56
  },
  {
    buyerId: 12,
    orderId: 5,
    firstName: "Clara",
    lastName: "White",
    address: '433 Water St',
    city: "San Francisco",
    state: "CA",
    zipCode: '94016',
    paymentMethod: 'Americano Expresso',
    paymentDetails: '0000',
    subTotal: 5.00,
    orderTotal: 5.41
  },
  {
    buyerId: 13,
    orderId: 6,
    firstName: "David",
    lastName: "Brown",
    address: '22444 A St',
    city: "Phoenix",
    state: "AZ",
    zipCode: '85001',
    paymentMethod: 'Americano Expresso',
    paymentDetails: '0000',
    subTotal: 100.00,
    orderTotal: 108.25
  },
  {
    buyerId: 1,
    orderId: 7,
    firstName: "Ellie",
    lastName: "Bellie",
    address: '555 Mission Blvd',
    city: "San Francisco",
    state: "CA",
    zipCode: '94107',
    paymentMethod: 'Americano Expresso',
    paymentDetails: '0000',
    subTotal: 79.00,
    orderTotal: 85.52
  },
  {
    buyerId: 11,
    orderId: 8,
    firstName: 'Ben',
    lastName: 'Smith',
    address: '123 Test St',
    city: 'Austin',
    state: 'TX',
    zipCode: '73301',
    paymentMethod: 'Americano Expresso',
    paymentDetails: '0000',
    subTotal: 30.00,
    orderTotal: 32.48
  },
  {
    buyerId: 15,
    orderId: 9,
    firstName: "Frank",
    lastName: "Johnson",
    address: '2222 Fifth St',
    city: "Seattle",
    state: "WA",
    zipCode: '98040',
    paymentMethod: 'Americano Expresso',
    paymentDetails: '0000',
    subTotal: 48.00,
    orderTotal: 51.96
  },
  {
    buyerId: 1,
    orderId: 10,
    firstName: "Ellie",
    lastName: "Bellie",
    address: '555 Mission Blvd',
    city: "San Francisco",
    state: "CA",
    zipCode: '94107',
    paymentMethod: 'Americano Expresso',
    paymentDetails: '0000',
    subTotal: 18.00,
    orderTotal: 19.49
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

  // async down(queryInterface, Sequelize) {
  //   options.tableName = 'Orders';
  //   const Op = Sequelize.Op;
  //   return queryInterface.bulkDelete(options, { [Op.or]: ordersList }, {})
  // }
  async down(queryInterface, Sequelize) {
    options.tableName = 'Orders';
    const ids = ordersList.map(order => order.id);
    return queryInterface.bulkDelete(options, { id: ids }, {})
  }

};
