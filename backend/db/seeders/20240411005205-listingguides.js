'use strict';

const { ListingGuide } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const listingGuidesList = [
  {
    listingId: 1,
    guideId: 1
  },
  {
    listingId: 1,
    guideId: 3
  },
  {
    listingId: 2,
    guideId: 3
  },
  {
    listingId: 5,
    guideId: 3
  },
  {
    listingId: 5,
    guideId: 1
  },
  {
    listingId: 6,
    guideId: 9
  },
  {
    listingId: 6,
    guideId: 6
  },
  {
    listingId: 6,
    guideId: 7
  },
  {
    listingId: 10,
    guideId: 5
  },
  {
    listingId: 11,
    guideId: 4
  },
  {
    listingId: 11,
    guideId: 8
  },
  {
    listingId: 18,
    guideId: 7
  },
  {
    listingId: 18,
    guideId: 4
  },
  {
    listingId: 15,
    guideId: 6
  },
  {
    listingId: 15,
    guideId: 5
  },
  {
    listingId: 15,
    guideId: 8
  },
  {
    listingId: 6,
    guideId: 3
  },
  {
    listingId: 6,
    guideId: 9
  },
]
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await ListingGuide.bulkCreate(listingGuidesList, { validate: true })
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'ListingGuides';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, { [Op.or]: listingGuidesList }, {});
  }
};
