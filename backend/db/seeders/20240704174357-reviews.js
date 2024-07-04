'use strict';

const { Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const reviewsList = [
  {
    listingId: 4,
    buyerId: 2,
    review: 'My rhaphidophora tetresperma came in perfect condition!',
    stars: 5
  },
  {
    listingId: 1,
    buyerId: 3,
    review: 'Fast shipping A+++',
    stars: 5
  },
  {
    listingId: 3,
    buyerId: 3,
    review: 'Fast shipping A+++',
    stars: 5
  },
  {
    listingId: 6,
    buyerId: 10,
    review: 'Plant was a little banged up during transport, but otherwise OK',
    stars: 4
  },
  {
    listingId: 51,
    buyerId: 1,
    review: 'Plant could have been better packaged honestly.',
    stars: 3
  },
  {
    listingId: 52,
    buyerId: 1,
    review: 'This package really needed a heat pack!',
    stars: 2
  },
  {
    listingId: 20,
    buyerId: 12,
    review: 'Awesome plant! Shipping was a tad slow',
    stars: 3
  },
  {
    listingId: 47,
    buyerId: 13,
    review: 'Excellent communication, came in excellent condition!',
    stars: 5
  },
  {
    listingId: 44,
    buyerId: 13,
    review: 'Excellent communication, came in excellent condition!',
    stars: 5
  },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await Review.bulkCreate(reviewsList, { validate: true })
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, { [Op.or]: reviewsList }, {})
  }
};
