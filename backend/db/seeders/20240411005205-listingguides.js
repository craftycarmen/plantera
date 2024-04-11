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
    guideId: 2
  },
  {
    listingId: 2,
    guideId: 3
  }
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
