'use strict';

const { Guide } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const guidesList = [
  {
    userId: 1,
    title: 'How to Care for Monsteras',
    description: 'Tips and tricks on how to make this classic plant thrive',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },
  {
    userId: 1,
    title: 'Top 5 Pet-Friendly Plants',
    description: 'A list of pet-friendly plants, from the ultimate pet and plant lover!',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Integer quis auctor elit sed vulputate mi sit amet mauris. Et molestie ac feugiat sed lectus. Mattis molestie a iaculis at erat. Tempor nec feugiat nisl pretium fusce id velit ut tortor. Maecenas pharetra convallis posuere morbi. Ornare arcu odio ut sem nulla pharetra. Pretium lectus quam id leo in vitae turpis massa. Elit ut aliquam purus sit amet. Lacus vestibulum sed arcu non odio euismod lacinia.'
  },
  {
    userId: 3,
    title: 'How to Keep Pests Away',
    description: 'Learn how to tell pests: "Pests, no pesting!"',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Integer quis auctor elit sed vulputate mi sit amet mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Integer quis auctor elit sed vulputate mi sit amet mauris.'
  },
]
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await Guide.bulkCreate(guidesList, { validate: true })
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Guides';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, { [Op.or]: guidesList }, {});
  }
};
