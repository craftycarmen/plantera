'use strict';

const { CartItem } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const cartItemsList = [
  {
    orderId: 1,
    listingId: 4,
    cartQty: 1,
    orderStatus: "Shipped"
  },
  {
    orderId: 2,
    listingId: 1,
    cartQty: 1,
    orderStatus: "Shipped"
  },
  {
    orderId: 2,
    listingId: 3,
    cartQty: 1,
    orderStatus: "Shipped"
  },
  {
    orderId: 3,
    listingId: 6,
    cartQty: 1,
    orderStatus: "Shipped"
  },
  {
    orderId: 3,
    listingId: 30,
    cartQty: 1,
    orderStatus: "Processing"
  },
  {
    orderId: 3,
    listingId: 48,
    cartQty: 1
  },
  {
    orderId: 4,
    listingId: 51,
    cartQty: 2,
    orderStatus: "Shipped"
  },
  {
    orderId: 4,
    listingId: 52,
    cartQty: 3,
    orderStatus: "Shipped"
  },
  {
    orderId: 5,
    listingId: 20,
    cartQty: 1,
    orderStatus: "Shipped"
  },
  {
    orderId: 6,
    listingId: 37,
    cartQty: 3,
    orderStatus: "Processing"
  },
  {
    orderId: 6,
    listingId: 47,
    cartQty: 2,
    orderStatus: "Shipped"
  },
  {
    orderId: 6,
    listingId: 44,
    cartQty: 1,
    orderStatus: "Shipped"
  },
  {
    orderId: 7,
    listingId: 40,
    cartQty: 1,
    orderStatus: "Processing"
  },
  {
    orderId: 7,
    listingId: 39,
    cartQty: 2,
  },
  {
    orderId: 8,
    listingId: 38,
    cartQty: 1
  },
  {
    orderId: 9,
    listingId: 56,
    cartQty: 1
  },
  {
    orderId: 9,
    listingId: 57,
    cartQty: 1
  },
  {
    orderId: 9,
    listingId: 60,
    cartQty: 1
  },
  {
    orderId: 10,
    listingId: 41,
    cartQty: 1
  },
]
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await CartItem.bulkCreate(cartItemsList, { validate: true })
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'CartItems';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, { [Op.or]: cartItemsList }, {});
  }
};
