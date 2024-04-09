'use strict';

const { ShoppingCart } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const shoppingCartsList = [
  {
    buyerId: 1,
  },
  {
    buyerId: 3,
  }
]
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await ShoppingCart.bulkCreate(shoppingCartsList, { validate: true })
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'ShoppingCarts';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, { [Op.or]: shoppingCartsList }, {});
  }
};
