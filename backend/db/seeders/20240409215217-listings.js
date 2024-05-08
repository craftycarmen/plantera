'use strict';

const { Listing } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const listingsList = [
  {
    sellerId: 1,
    guideId: 1,
    plantName: 'Monstera',
    description: 'This is a full grown monstera in an 8.5-inch pot in soil, comes with the pot. It has unfortunately getting too large for my home, so it needs a new home!',
    price: 75,
    potSize: 8,
    stockQty: 3
  },
  {
    sellerId: 2,
    plantName: 'Ficus Tineke',
    guideId: 3,
    description: 'Grew these from cuttings to 4" plants. Came from a luscious mother plant',
    price: 10,
    potSize: 4,
    stockQty: 4
  },
  {
    sellerId: 1,
    plantName: 'Snow Queen Pothos',
    description: 'The pothos that just keeps on giving. I had to trim the mother plant because she was getting sooo long.',
    price: 5,
    potSize: 2,
    stockQty: 8
  },
  {
    sellerId: 1,
    plantName: 'Rhaphidophora Tetresperma',
    description: 'My first plant! It has grown a whole bunch, so I\'ve some to share with you all! This is an easy plant, too.',
    price: 15,
    potSize: 4,
    stockQty: 0
  }
]
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await Listing.bulkCreate(listingsList, { validate: true })
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Listings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, { [Op.or]: listingsList }, {});
  }
};
