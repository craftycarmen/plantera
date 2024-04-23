'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const usersList = [
  {
    firstName: 'Demorita',
    lastName: 'Usersmith',
    email: 'demo@user.io',
    username: 'PlanteraDemo',
    hashedPassword: bcrypt.hashSync('password'),
    bio: 'My room is a jungle filled with plants.',
    favoritePlant: 'Monstera',
    city: 'San Francisco',
    state: 'CA',
    accountType: 'seller',
    shopDescription: 'I take great pride in caring for my plants. You will not be disappointed!',
    paymentMethod: 'Bank of Americano',
    paymentDetails: 1234
  },
  {
    firstName: 'Kingston',
    lastName: 'Shmingston',
    email: 'user1@user.io',
    username: 'Plants4Life',
    hashedPassword: bcrypt.hashSync('password'),
    city: 'New York',
    state: 'NY',
    accountType: 'buyer'
  },
  {
    firstName: 'Ellie',
    lastName: 'Bellie',
    email: 'user2@user.io',
    username: 'PlantJungle',
    hashedPassword: bcrypt.hashSync('password'),
    bio: 'My thumb is the greenest of green!',
    favoritePlant: 'Hoya australis',
    accountType: 'buyer'
  }
]

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await User.bulkCreate(usersList, { validate: true })
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, { [Op.or]: usersList }, {});
  }
};
