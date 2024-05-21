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
  {
    sellerId: 3,
    plantName: "Fiddle Leaf Fig",
    description: "This beautiful Fiddle Leaf Fig is perfect for brightening up any room. It's a bit of a diva but totally worth it for its stunning, large leaves.",
    price: 45,
    potSize: 10,
    stockQty: 7
  },
  {
    sellerId: 1,
    plantName: "Sansevieria Golden Flame Snake Plant",
    description: "The Snake Plant is a hardy, low-maintenance plant that's perfect for beginners. It tolerates low light and is nearly impossible to kill.",
    price: 5,
    potSize: 4,
    stockQty: 15
  },
  {
    sellerId: 4,
    plantName: "Monstera Deliciosa",
    description: "Monstera Deliciosa adds a tropical vibe to your space with its unique, split leaves.",
    price: 50,
    potSize: 12,
    stockQty: 10
  },
  {
    sellerId: 7,
    plantName: "ZZ Plant",
    description: "The ZZ Plant is perfect for any office or home. It's incredibly low maintenance, tolerating low light and needing minimal water.",
    price: 30,
    potSize: 6,
    stockQty: 20
  },
  {
    sellerId: 2,
    plantName: "Peace Lily",
    description: "The Peace Lily is not only beautiful with its glossy leaves and white blooms, but it also helps purify the air in your home.",
    price: 35,
    potSize: 8,
    stockQty: 12
  },
  {
    sellerId: 9,
    plantName: "Golden Pothos",
    description: "This golden pothos is a versatile and easy-to-grow plant, perfect for hanging baskets or trailing over shelves. It's a great starter plant!",
    price: 15,
    potSize: 4,
    stockQty: 30
  },
  {
    sellerId: 6,
    plantName: "Spider Plant",
    description: "With its arching green and white striped leaves, the Spider Plant is a classic favorite that's easy to care for and fun to propagate.",
    price: 20,
    potSize: 5,
    stockQty: 25
  },
  {
    sellerId: 10,
    plantName: "Aloe Vera",
    description: "Aloe Vera is not only a beautiful succulent but also a useful one. Its gel can soothe burns and skin irritations, making it a great addition to your home.",
    price: 18,
    potSize: 6,
    stockQty: 18
  },
  {
    sellerId: 5,
    plantName: "Ficus Burgundy",
    description: "The Ficus Burgundy is an elegant and easy-care option with its deep green, glossy leaves. It can grow quite large, making it a striking focal point.",
    price: 40,
    potSize: 10,
    stockQty: 8
  },
  {
    sellerId: 8,
    plantName: "Jade Plant",
    description: "Jade Plants are lovely succulents that are believed to bring good luck. They're easy to care for and have a charming, tree-like appearance.",
    price: 22,
    potSize: 4,
    stockQty: 22
  },
  {
    sellerId: 3,
    plantName: "Boston Fern",
    description: "The Boston Fern is a lush, elegant plant that adds a touch of nature to any space. It's perfect for hanging baskets and requires regular misting.",
    price: 25,
    potSize: 8,
    stockQty: 12
  },
  {
    sellerId: 1,
    plantName: "Philodendron Brasil",
    description: "Philodendron Brasil is a vibrant and easy-to-care-for plant with heart-shaped leaves featuring unique yellow and green variegation.",
    price: 20,
    potSize: 6,
    stockQty: 20
  },
  {
    sellerId: 5,
    plantName: "Bird's Nest Fern",
    description: "With its wavy, bright green fronds, the Bird's Nest Fern is a unique addition to any plant collection and thrives in humid environments.",
    price: 22,
    potSize: 8,
    stockQty: 10
  },
  {
    sellerId: 4,
    plantName: "Chinese Money Plant",
    description: "The Chinese Money Plant, also known as Pilea, has charming, round leaves and is said to bring good fortune to its owner.",
    price: 18,
    potSize: 4,
    stockQty: 25
  },
  {
    sellerId: 9,
    plantName: "String of Pearls",
    description: "String of Pearls is a unique succulent with trailing, bead-like foliage. It looks stunning in hanging baskets or draped over shelves.",
    price: 35,
    potSize: 6,
    stockQty: 18
  },
  {
    sellerId: 2,
    plantName: "Hoya Pubicalyx Splash",
    description: "Hoya, also known as Wax Plant, has thick, waxy leaves and produces beautiful, fragrant flowers. It's a great option for hanging baskets.",
    price: 30,
    potSize: 5,
    stockQty: 22
  },
  {
    sellerId: 8,
    plantName: "Majesty Palm",
    description: "The Majesty Palm is a tall, elegant plant that brings a tropical feel to your home. It loves bright, indirect light and regular watering.",
    price: 40,
    potSize: 10,
    stockQty: 9
  },
  {
    sellerId: 10,
    plantName: "Bromeliad",
    description: "Bromeliads are exotic plants with striking foliage and vibrant flowers. They're low-maintenance and add a tropical touch to any room.",
    price: 25,
    potSize: 6,
    stockQty: 14
  },
  {
    sellerId: 1,
    plantName: "Cactus Collection",
    description: "This collection of miniature cacti is perfect for sunny windowsills. Each set includes a variety of shapes and sizes, adding charm to your home.",
    price: 20,
    potSize: 3,
    stockQty: 50
  },
  {
    sellerId: 4,
    plantName: "Croton",
    description: "Crotons are known for their colorful, variegated leaves. They thrive in bright light and add a vibrant touch to any indoor garden.",
    price: 30,
    potSize: 8,
    stockQty: 12
  },
  {
    sellerId: 7,
    plantName: "Dieffenbachia",
    description: "Dieffenbachia, or Dumb Cane, is a stunning plant with large, variegated leaves. It's easy to care for and brightens up any indoor space.",
    price: 22,
    potSize: 10,
    stockQty: 10
  },
  {
    sellerId: 5,
    plantName: "Ficus Audrey",
    description: "Ficus Audrey is a trendy plant with velvety leaves and a bold appearance. It prefers bright, indirect light and regular watering.",
    price: 35,
    potSize: 12,
    stockQty: 7
  },
  {
    sellerId: 9,
    plantName: "Lucky Bamboo",
    description: "Lucky Bamboo is an easy-to-care-for plant that thrives in water or soil. It's believed to bring good luck and prosperity to its owner.",
    price: 18,
    potSize: 4,
    stockQty: 40
  },
  {
    sellerId: 2,
    plantName: "Maidenhair Fern",
    description: "Maidenhair Ferns have delicate, lacy fronds that add elegance to any space. They prefer humid environments and indirect light.",
    price: 20,
    potSize: 6,
    stockQty: 15
  },
  {
    sellerId: 8,
    plantName: "Red Maranta Prayer Plant",
    description: "Maranta, also known as the Prayer Plant, has beautiful, patterned leaves that fold up at night. It's a low-light plant that's easy to care for.",
    price: 22,
    potSize: 4,
    stockQty: 18
  },
  {
    sellerId: 6,
    plantName: "Oxalis",
    description: "Oxalis, or the Purple Shamrock, has striking, clover-like leaves and delicate flowers. It's a charming plant that adds a pop of color to any space.",
    price: 18,
    potSize: 5,
    stockQty: 25
  },
  {
    sellerId: 3,
    plantName: "Parlor Palm",
    description: "The Parlor Palm is a classic houseplant that's perfect for any room. It thrives in low light and is very low maintenance.",
    price: 28,
    potSize: 8,
    stockQty: 14
  },
  {
    sellerId: 10,
    plantName: "Watermelon Peperomia",
    description: "Watermelon peperomia is a versatile plant with thick, textured leaves that looks like watermelons–hence the plantName!",
    price: 15,
    potSize: 4,
    stockQty: 30
  },
  {
    sellerId: 1,
    plantName: "Pitcher Plant",
    description: "The Pitcher Plant is a fascinating carnivorous plant that traps insects in its pitcher-shaped leaves. It's a unique addition to any plant collection.",
    price: 25,
    potSize: 5,
    stockQty: 10
  },
  {
    sellerId: 4,
    plantName: "Ponytail Palm",
    description: "Ponytail Palm is a quirky, drought-tolerant plant with a bulbous trunk and long, curly leaves. It's perfect for sunny spots.",
    price: 35,
    potSize: 6,
    stockQty: 12
  },
  {
    sellerId: 7,
    plantName: "Purple Heart",
    description: "Purple Heart is a striking plant with vibrant purple leaves. It's easy to grow and looks stunning in hanging baskets or as ground cover.",
    price: 18,
    potSize: 6,
    stockQty: 22
  },
  {
    sellerId: 5,
    plantName: "Angel Wing Begonia",
    description: "Angel Wing Begonia leaves are shaped like ange wings. They're a perfect plant with uniquely-shaped leaves to add to your indoor garden.",
    price: 25,
    potSize: 6,
    stockQty: 16
  },
  {
    sellerId: 2,
    plantName: "Satin Pothos",
    description: "Scindapsus Pictus, or Satin Pothos, has velvety, silver-spotted leaves. It's an easy-care plant that thrives in low to bright indirect light.",
    price: 22,
    potSize: 6,
    stockQty: 18
  },
  {
    sellerId: 8,
    plantName: "Burro's Tail",
    description: "Sedum Morganianum, or Burro's Tail, is a succulent with trailing, bead-like foliage. It's perfect for hanging baskets and sunny spots.",
    price: 28,
    potSize: 6,
    stockQty: 14
  },
  {
    sellerId: 6,
    plantName: "Staghorn Fern",
    description: "Staghorn Ferns are unique epiphytes with antler-like fronds. They thrive mounted on plaques and make a statement piece for any room.",
    price: 35,
    potSize: 8,
    stockQty: 10
  },
  {
    sellerId: 3,
    plantName: "Tradescantia Zebrina",
    description: "Tradescantia Zebrina has striking purple and silver striped leaves. It's an easy-care plant that adds color to any space.",
    price: 20,
    potSize: 4,
    stockQty: 22
  },
  {
    sellerId: 10,
    plantName: "Venus Flytrap",
    description: "The Venus Flytrap is a captivating carnivorous plant that traps insects with its jaw-like leaves. It's a fun and educational plant to grow.",
    price: 18,
    potSize: 3,
    stockQty: 25
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
