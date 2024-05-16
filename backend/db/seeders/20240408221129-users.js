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
    username: 'PlantJungle',
    hashedPassword: bcrypt.hashSync('password50!'),
    city: 'New York',
    state: 'NY',
    accountType: 'seller',
    shopDescription: 'Take a piece of my plant jungle home!',
    paymentMethod: 'Bank of Americano',
    paymentDetails: 1234
  },
  {
    firstName: 'Ellie',
    lastName: 'Bellie',
    email: 'user2@user.io',
    username: 'Plants4Life',
    hashedPassword: bcrypt.hashSync('password51!'),
    city: 'San Jose',
    state: 'CA',
    bio: 'My thumb is the greenest of green!',
    favoritePlant: 'Hoya australis',
    accountType: 'buyer'
  },
  {
    firstName: 'Ava',
    lastName: 'Brooks',
    email: 'user3@user.io',
    username: 'GreenThumbGuru',
    hashedPassword: bcrypt.hashSync('password52!'),
    city: 'Houston',
    state: 'TX',
    bio: "🌿 Plant enthusiast spreading green love, one leaf at a time. 🌱 Nature's beauty is my daily inspiration. 🌸",
    favoritePlant: 'Ivy',
    accountType: 'buyer'
  },
  {
    firstName: 'Mia',
    lastName: 'Parker',
    email: 'user4@user.io',
    username: 'LeafyLover',
    hashedPassword: bcrypt.hashSync('password53!'),
    city: 'Des Moines',
    state: 'IA',
    bio: "Growing dreams and nurturing nature's wonders. 🌿 Passionate about plants and their endless stories",
    favoritePlant: 'Monstera',
    accountType: 'seller',
    shopDescription: "Welcome to Leafy Haven! Your go-to destination for lush greenery and botanical treasures. Let's cultivate happiness together!",
    paymentMethod: 'Bank of Americano',
    paymentDetails: 1234
  },
  {
    firstName: 'Noah',
    lastName: 'Sullivan',
    email: 'user5@user.io',
    username: 'BotanicalBloomer',
    hashedPassword: bcrypt.hashSync('password54!'),
    city: 'Salt Lake City',
    state: 'UT',
    bio: "🌱 Plant parent on a mission to cultivate happiness and foster growth. 🌿 Embracing the beauty of nature's creations. 🌺",
    favoritePlant: 'Syngonium Tri-Color',
    accountType: 'buyer'
  },
  {
    firstName: 'Isabella',
    lastName: 'Lopes',
    email: 'user6@user.io',
    username: 'PlantPassion',
    hashedPassword: bcrypt.hashSync('password55!'),
    city: 'Gilroy',
    state: 'CA',
    bio: "At PlantPassion, our love for plants drives everything we do. Explore our curated collection of green wonders and bring nature home.",
    favoritePlant: 'Ficus Burgandy',
    accountType: 'seller'
  },
  {
    firstName: 'Liam',
    lastName: 'Hayes',
    email: 'user7@user.io',
    username: 'VerdantVibes',
    hashedPassword: bcrypt.hashSync('password56!'),
    city: 'Miami',
    state: 'FL',
    bio: "Wanderer in the garden of life, tending to dreams and blossoms alike. Let's grow together, one leaf at a time.",
    favoritePlant: 'Syngonium Albo',
    accountType: 'seller',
    shopDescription: "At Verdant Vibes, we're passionate about plants! Explore our curated collection of green wonders and bring nature home.",
    paymentMethod: 'Bank of Americano',
    paymentDetails: 1234
  },
  {
    firstName: 'Alex',
    lastName: 'Parker',
    email: 'user8@user.io',
    username: 'FloraFanatic',
    hashedPassword: bcrypt.hashSync('password57!'),
    city: 'Atlanta',
    state: 'GA',
    bio: " Seeking serenity in the embrace of leaves and petals. 🌸 Planting seeds of joy and watching them bloom.",
    favoritePlant: 'Golden Pothos',
    accountType: 'buyer'
  },
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
