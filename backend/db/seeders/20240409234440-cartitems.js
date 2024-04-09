'use strict';

const { CartItem } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const cartItemsList = [
  {
    cartId: 1,
    listingId: 2,
    cartQty: 2
  },
  {
    cartId: 2,
    listingId: 1,
    cartQty: 1
  },
  {
    cartId: 2,
    listingId: 3,
    cartQty: 1
  }
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
