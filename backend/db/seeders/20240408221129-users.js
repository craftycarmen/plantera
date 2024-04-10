'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const usersList = [
  {
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@user.io',
    username: 'PlanteraDemo',
    hashedPassword: bcrypt.hashSync('password'),
    bio: 'My room is a jungle filled with plants.',
    favoritePlant: 'Monstera',
    accountType: 'seller',
    shopDescription: 'I take great pride in caring for my plants. You will not be disappointed!',
    paymentMethod: 'Bank of Americano',
    paymentDetails: 1234
  },
  {
    firstName: 'Demo1',
    lastName: 'User',
    email: 'user1@user.io',
    username: 'FakeUser1',
    hashedPassword: bcrypt.hashSync('password'),
    accountType: 'buyer'
  },
  {
    firstName: 'Demo2',
    lastName: 'User',
    email: 'user2@user.io',
    username: 'FakeUser2',
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
    return queryInterface.bulkDelete(options, { [Op.or]: listOfUsers }, {});
  }
};
