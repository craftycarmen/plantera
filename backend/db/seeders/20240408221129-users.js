'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const usersList = [
  {
    firstName: 'Ellie',
    lastName: 'Bellie',
    email: 'demo@user.io',
    username: 'PlanteraDemo',
    hashedPassword: bcrypt.hashSync('password'),
    bio: 'My room is a jungle filled with plants.',
    favoritePlant: 'Monstera',
    city: 'San Francisco',
    state: 'CA',
    accountType: 'seller',
    shopDescription: 'I take great pride in caring for my plants. You will not be disappointed!',
    paymentMethod: 'Fells Wargo',
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
    paymentMethod: 'Pursuit',
    paymentDetails: 1998
  },
  {
    firstName: 'Rachel',
    lastName: 'Jones',
    email: 'user2@user.io',
    username: 'Plants4Life',
    hashedPassword: bcrypt.hashSync('password51!'),
    city: 'San Jose',
    state: 'CA',
    bio: 'My thumb is the greenest of green!',
    favoritePlant: 'Hoya australis',
    accountType: 'seller',
    shopDescription: "My love for plants shines through in every carefully curated selection. From lush ferns to vibrant succulents, each plant is chosen to bring life and happiness to your home. Join me in spreading the green love!",
    paymentMethod: 'Pursuit',
    paymentDetails: 3809
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
    accountType: 'seller',
    shopDescription: "I'm dedicated to sharing the beauty and serenity that plants bring. Explore a variety of easy-care and rare houseplants, each nurtured with love and ready to brighten your space. Happy growing!",
    paymentMethod: 'Fells Wargo',
    paymentDetails: 9856
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
    paymentMethod: 'Fells Wargo',
    paymentDetails: 1254
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
    accountType: 'seller',
    shopDescription: "I offer a handpicked selection of thriving plants, perfect for any level of plant parent. Let's transform your home into a lush oasis!",
    paymentMethod: 'Bank of Americano',
    paymentDetails: 7862
  },
  {
    firstName: 'Isabella',
    lastName: 'Lopes',
    email: 'user6@user.io',
    username: 'PlantPassion',
    hashedPassword: bcrypt.hashSync('password55!'),
    city: 'Gilroy',
    state: 'CA',
    bio: "🌿 Plant lover, earth advocate, and green soul. 🌱 Finding solace in the quiet beauty of nature's bounty. 🍃",
    favoritePlant: 'Ficus Burgandy',
    accountType: 'seller',
    shopDescription: "My love for plants drives everything I do. Explore my curated collection of green wonders and bring nature home.",
    paymentMethod: 'Pursuit',
    paymentDetails: 4530
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
    shopDescription: "Step into my botanical wonderland. From rare finds to everyday favorites, I have the perfect plant for every space.",
    paymentMethod: 'Fells Wargo',
    paymentDetails: 2235
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
    accountType: 'seller',
    shopDescription: "Welcome to FloraFanatic! As a passionate plant lover, I take pride in offering a diverse selection of healthy, beautiful houseplants. Each plant is carefully nurtured and selected to bring joy and greenery into your home. Let's grow together! 🌿🌸",
    paymentMethod: 'Fells Wargo',
    paymentDetails: 1234
  },
  {
    firstName: "Alice",
    lastName: "Greenfield",
    email: "alice.greenfield@example.com",
    username: "PlantLoverAlice",
    hashedPassword: bcrypt.hashSync("mypassword123"),
    city: "Portland",
    state: "OR",
    bio: "I'm Alice and I've been passionate about plants since I was a child. I love creating indoor jungles and sharing plant care tips.",
    favoritePlant: "Monstera Deliciosa",
    accountType: 'seller',
    shopDescription: "I THRIVE off of plants and I'm so excited to share my collection with you!",
    paymentMethod: 'Pursuit',
    paymentDetails: 1534
  },
  {
    firstName: "Ben",
    lastName: "Smith",
    email: "ben.smith@example.com",
    username: "GreenThumbBen",
    hashedPassword: bcrypt.hashSync("securePass456"),
    city: "Austin",
    state: "TX",
    bio: "Hi, I'm Ben! I enjoy collecting rare houseplants and experimenting with propagation techniques.",
    favoritePlant: "Fiddle Leaf Fig",
    accountType: "buyer"
  },
  {
    firstName: "Clara",
    lastName: "White",
    email: "clara.white@example.com",
    username: "FernFanClara",
    hashedPassword: bcrypt.hashSync("password789"),
    city: "San Francisco",
    state: "CA",
    bio: "I'm Clara, a plant enthusiast who loves decorating with ferns and tropical plants. They bring peace to my home.",
    favoritePlant: "Boston Fern",
    accountType: "buyer"
  },
  {
    firstName: "David",
    lastName: "Brown",
    email: "david.brown@example.com",
    username: "CactusKingDavid",
    hashedPassword: bcrypt.hashSync("myCactusLove123"),
    city: "Phoenix",
    state: "AZ",
    bio: "Hello! I'm David, and I specialize in growing and caring for various types of cacti and succulents.",
    favoritePlant: "Saguaro Cactus",
    accountType: "buyer"
  },
  {
    firstName: "Emma",
    lastName: "Davis",
    email: "emma.davis@example.com",
    username: "CactiEmma",
    hashedPassword: bcrypt.hashSync("greenThumb321"),
    city: "San Diego",
    state: "CA",
    bio: "I'm Emma, and I have a deep love for desert plants. They add charm and resilience to my garden.",
    favoritePlant: "Aloe Vera",
    accountType: "buyer"
  },
  {
    firstName: "Frank",
    lastName: "Johnson",
    email: "frank.johnson@example.com",
    username: "PlantFrank",
    hashedPassword: bcrypt.hashSync("strongPassword456"),
    city: "Seattle",
    state: "WA",
    bio: "Hey, I'm Frank! My passion is urban gardening, and I love sharing my plant journey with others.",
    favoritePlant: "Snake Plant",
    accountType: "buyer"
  },
  {
    firstName: "Grace",
    lastName: "Wilson",
    email: "grace.wilson@example.com",
    username: "LeafyGrace",
    hashedPassword: bcrypt.hashSync("passwordGrace789"),
    city: "Chicago",
    state: "IL",
    bio: "I'm Grace, a houseplant lover who enjoys filling my home with lush greenery and learning new plant care techniques.",
    favoritePlant: "ZZ Plant",
    accountType: "buyer"
  },
  {
    firstName: "Henry",
    lastName: "Lee",
    email: "henry.lee@example.com",
    username: "PlantHenry",
    hashedPassword: bcrypt.hashSync("henryPass123"),
    city: "New York",
    state: "NY",
    bio: "Hello, I'm Henry! I'm dedicated to cultivating a diverse plant collection and creating a green oasis in my apartment.",
    favoritePlant: "Philodendron Brasil",
    accountType: "buyer"
  },
  {
    firstName: "Isabella",
    lastName: "Martinez",
    email: "isabella.martinez@example.com",
    username: "PlantBella",
    hashedPassword: bcrypt.hashSync("myPlants456"),
    city: "Los Angeles",
    state: "CA",
    bio: "I'm Isabella, and my passion lies in growing tropical plants and creating a serene indoor garden space.",
    favoritePlant: "Calathea",
    accountType: "buyer"
  },
  {
    firstName: "Jack",
    lastName: "Garcia",
    email: "jack.garcia@example.com",
    username: "GreenJack",
    hashedPassword: bcrypt.hashSync("jackGreen123"),
    city: "Miami",
    state: "FL",
    bio: "Hi, I'm Jack! I love experimenting with different plant species and turning my home into a lush paradise.",
    favoritePlant: "Bird of Paradise",
    accountType: "buyer"
  },
  {
    firstName: "Karen",
    lastName: "Clark",
    email: "karen.clark@example.com",
    username: "PlantLoverKaren",
    hashedPassword: bcrypt.hashSync("secureKaren789"),
    city: "Denver",
    state: "CO",
    bio: "I'm Karen, and I adore indoor plants that purify the air and add a touch of nature to my living space.",
    favoritePlant: "Peace Lily",
    accountType: "buyer"
  },
  {
    firstName: "Liam",
    lastName: "Robinson",
    email: "liam.robinson@example.com",
    username: "PlantLiam",
    hashedPassword: bcrypt.hashSync("liamPlants321"),
    city: "Boston",
    state: "MA",
    bio: "Hey, I'm Liam! I'm passionate about sustainable gardening and love growing plants that thrive in urban environments.",
    favoritePlant: "Spider Plant",
    accountType: "buyer"
  },
  {
    firstName: "Mia",
    lastName: "Walker",
    email: "mia.walker@example.com",
    username: "GreenMia",
    hashedPassword: bcrypt.hashSync("greenPass456"),
    city: "Charlotte",
    state: "NC",
    bio: "I'm Mia, a plant enthusiast who finds joy in nurturing rare and exotic plants in my home.",
    favoritePlant: "Rubber Plant",
    accountType: "buyer"
  },
  {
    firstName: "Noah",
    lastName: "Harris",
    email: "noah.harris@example.com",
    username: "PlantNoah",
    hashedPassword: bcrypt.hashSync("noahGreen123"),
    city: "Nashville",
    state: "TN",
    bio: "Hello, I'm Noah! I enjoy creating vibrant plant displays and sharing my love for greenery with the community.",
    favoritePlant: "Jade Plant",
    accountType: "buyer"
  },
  {
    firstName: "Olivia",
    lastName: "King",
    email: "olivia.king@example.com",
    username: "OliviaGreens",
    hashedPassword: bcrypt.hashSync("plantLove789"),
    city: "Atlanta",
    state: "GA",
    bio: "I'm Olivia, a dedicated plant lover who enjoys turning any space into a green sanctuary with my collection.",
    favoritePlant: "Pothos",
    accountType: "buyer"
  },
  {
    firstName: "Paul",
    lastName: "Martinez",
    email: "paul.martinez@example.com",
    username: "GreenThumbPaul",
    hashedPassword: bcrypt.hashSync("paulPass321"),
    city: "San Antonio",
    state: "TX",
    bio: "Hi, I'm Paul! My love for plants drives me to cultivate a diverse collection and share the joy of gardening with others.",
    favoritePlant: "Orchid",
    accountType: "buyer"
  },
  {
    firstName: "Quinn",
    lastName: "Brown",
    email: "quinn.brown@example.com",
    username: "LeafyQuinn",
    hashedPassword: bcrypt.hashSync("quinnPlant456"),
    city: "Cleveland",
    state: "OH",
    bio: "I'm Quinn, a plant enthusiast who loves creating lush green corners in my home and experimenting with different plant species.",
    favoritePlant: "Ficus",
    accountType: "buyer"
  },
  {
    firstName: "Rachel",
    lastName: "Taylor",
    email: "rachel.taylor@example.com",
    username: "PlantRachel",
    hashedPassword: bcrypt.hashSync("rachelGreen789"),
    city: "Sacramento",
    state: "CA",
    bio: "Hello, I'm Rachel! I have a passion for growing houseplants and turning my living space into an indoor jungle.",
    favoritePlant: "African Violet",
    accountType: "buyer"
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
