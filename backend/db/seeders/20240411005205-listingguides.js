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
  {
    listingId: 55,
    guideId: 24
  },
  {
    listingId: 54,
    guideId: 21
  },
  {
    listingId: 54,
    guideId: 15
  },
  {
    listingId: 54,
    guideId: 9
  },
  {
    listingId: 52,
    guideId: 11
  },
  {
    listingId: 52,
    guideId: 14
  },
  {
    listingId: 51,
    guideId: 17
  },
  {
    listingId: 51,
    guideId: 16
  },
  {
    listingId: 51,
    guideId: 18
  },
  {
    listingId: 50,
    guideId: 17
  },
  {
    listingId: 50,
    guideId: 20
  },
  {
    listingId: 49,
    guideId: 22
  },
  {
    listingId: 49,
    guideId: 23
  },
  {
    listingId: 47,
    guideId: 24
  },
  {
    listingId: 46,
    guideId: 23
  },
  {
    listingId: 46,
    guideId: 2
  },
  {
    listingId: 46,
    guideId: 3
  },
  {
    listingId: 45,
    guideId: 5
  },
  {
    listingId: 45,
    guideId: 6
  },
  {
    listingId: 45,
    guideId: 7
  },
  {
    listingId: 44,
    guideId: 8
  },
  {
    listingId: 43,
    guideId: 8
  },
  {
    listingId: 43,
    guideId: 14
  },
  {
    listingId: 41,
    guideId: 16
  },
  {
    listingId: 41,
    guideId: 17
  },
  {
    listingId: 41,
    guideId: 18
  },
  {
    listingId: 40,
    guideId: 19
  },
  {
    listingId: 39,
    guideId: 22
  },
  {
    listingId: 39,
    guideId: 14
  },
  {
    listingId: 38,
    guideId: 7
  },
  {
    listingId: 38,
    guideId: 15
  },
  {
    listingId: 38,
    guideId: 4
  },
  {
    listingId: 37,
    guideId: 4
  },
  {
    listingId: 37,
    guideId: 11
  },
  {
    listingId: 36,
    guideId: 18
  },
  {
    listingId: 35,
    guideId: 20
  },
  {
    listingId: 35,
    guideId: 23
  },
  {
    listingId: 34,
    guideId: 9
  },
  {
    listingId: 34,
    guideId: 6
  },
  {
    listingId: 34,
    guideId: 5
  },
  {
    listingId: 33,
    guideId: 11
  },
  {
    listingId: 32,
    guideId: 2
  },
  {
    listingId: 32,
    guideId: 19
  },
  {
    listingId: 31,
    guideId: 20
  },
  {
    listingId: 30,
    guideId: 21
  },
  {
    listingId: 30,
    guideId: 4
  },
  {
    listingId: 29,
    guideId: 2
  },
  {
    listingId: 29,
    guideId: 8
  },
  {
    listingId: 28,
    guideId: 18
  },
  {
    listingId: 27,
    guideId: 11
  },
  {
    listingId: 27,
    guideId: 7
  },
  {
    listingId: 27,
    guideId: 5
  },
  {
    listingId: 26,
    guideId: 18
  },
  {
    listingId: 26,
    guideId: 12
  },
  {
    listingId: 25,
    guideId: 2
  },
  {
    listingId: 25,
    guideId: 18
  },
  {
    listingId: 25,
    guideId: 12
  },
  {
    listingId: 24,
    guideId: 18
  },
  {
    listingId: 22,
    guideId: 10
  },
  {
    listingId: 23,
    guideId: 12
  },
  {
    listingId: 21,
    guideId: 1
  },
  {
    listingId: 21,
    guideId: 15
  },
  {
    listingId: 20,
    guideId: 10
  },
  {
    listingId: 20,
    guideId: 12
  },
  {
    listingId: 20,
    guideId: 10
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
