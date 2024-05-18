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
    description: 'This is a full grown monstera in an 8-inch pot in soil, comes with the pot. It has unfortunately getting too large for my home, so it needs a new home!',
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
  },
  {
    sellerId: 5,
    plantName: 'Philodendron Pink Princess',
    description: "Rare and radiant, this Pink Princess thrives in my care. Grown from a tiny cutting, she's now a stunning centerpiece for your collection.",
    price: 50,
    potSize: 5,
    stockQty: 1
  },
  {
    sellerId: 1,
    plantName: "Syngonium Albo",
    description: "From a single cutting, my Albo has flourished into a vision of white and green beauty. Add this beauty to your space",
    price: 105,
    potSize: 10,
    stockQty: 2
  },
  {
    sellerId: 8,
    plantName: "Philodendron Micans",
    description: "This is a personal favorite of mine because of the dark velvery leaves.",
    price: 18,
    potSize: 5,
    stockQty: 3
  },
  {
    sellerId: 5,
    plantName: "Philodendron Lemon Lime",
    description: "Bright and vibrant, my Lemon Lime is a testament to my passion for plants. Grown with care, she brings a burst of citrusy energy to any room.",
    price: 32,
    potSize: 7,
    stockQty: 2
  },
  {
    sellerId: 2,
    plantName: "String of Hearts",
    description: "This one is easy to care for and simply just cute. Oh, and it blooms when it's happy!",
    price: 26,
    potSize: 6,
    stockQty: 1
  },
  {
    sellerId: 5,
    plantName: "ZZ Raven",
    description: "The ZZ raven is bold and mysterious. New growth is bright green, and then the leaves mature into nearly black leaves (no it's not dying!).",
    price: 80,
    potSize: 7,
    stockQty: 5
  },
  {
    sellerId: 7,
    plantName: "Syngonium Mojito",
    description: "Tropical vibes abound with this Mojito! Grown with care, she's a refreshing splash of green and white, bringing a taste of paradise to your home.",
    price: 30,
    potSize: 5,
    stockQty: 1
  },
  {
    sellerId: 7,
    plantName: "Monstera Adansonii",
    description: "Also known as the swiss cheese plant—this one is a classic. Make sure to use a trellis of some sort so it can really thrive and fenestrate.",
    price: 15,
    potSize: 8,
    stockQty: 12
  },
  {
    sellerId: 8,
    plantName: "Tradescantia Zebrina",
    description: "If you love purple or are looking for a gift for someone who loves the color, the tradescantia zebrina is perfect! There aren't many naturally colored plants out there, so make this the one.",
    price: 60,
    potSize: 12,
    stockQty: 2
  },
  {
    sellerId: 8,
    plantName: "Hoya Compacta Variegata",
    description: "This hoya rope is just simply beautiful. Thanks to the variegation, you get splashes of green, creamy white, and pink.",
    price: 15,
    potSize: 3,
    stockQty: 15
  },
  {
    sellerId: 1,
    plantName: "Ficus Shivereana",
    description: "Not your standard ficus! Look at the beautiful patterns on the leaves.",
    price: 200,
    potSize: 11,
    stockQty: 1
  },
  {
    sellerId: 7,
    plantName: "ZZ Chameleon",
    description: "If you're familiar with the ZZ raven, the chameleon is similar! Except the leaves mature in to a bright yellow color",
    price: 45,
    potSize: 4,
    stockQty: 3
  },
  {
    sellerId: 8,
    plantName: "Marble Queen Pothos",
    description: "Majestic and pure, my Marble Queen shines bright. Grown with dedication, she's a symbol of purity and beauty, ready to thrive in your care.",
    price: 40,
    potSize: 8,
    stockQty: 0
  },
  {
    sellerId: 2,
    plantName: "Pothos N'Joy",
    description: "Joyful and vibrant, my N'Joy is a delight to behold. Grown with love, she's a constant source of happiness, ready to bring smiles to your home.",
    price: 60,
    potSize: 11,
    stockQty: 5
  },
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
