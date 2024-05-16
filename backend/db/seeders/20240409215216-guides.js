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
    description: 'Essential tips for nurturing healthy Monsteras at home',
    content: "<p>Monsteras, with their striking foliage, are popular houseplants known for their easy maintenance and vibrant appearance. Follow these simple care guidelines to keep your Monstera thriving.</p> <h2>1. Proper Watering</h2> <p>Ensure the soil is evenly moist but not waterlogged. Water when the top inch of soil feels dry to the touch, usually every 1-2 weeks. Adjust frequency based on humidity levels and season.</p> <h2>2. Adequate Lighting</h2> <p>Place your Monstera in bright, indirect sunlight to encourage healthy growth. Avoid direct sunlight, which can scorch the leaves. In low light conditions, growth may slow down.</p> <h2>3. Humidity Levels</h2> <p>Monsteras prefer high humidity environments. Mist the leaves regularly or place a humidifier nearby, especially during dry seasons or in air-conditioned rooms.</p> <h2>4. Proper Drainage</h2> <p>Ensure your Monstera's pot has drainage holes to prevent waterlogging. Excess moisture can lead to root rot and other fungal diseases.</p> <h2>5. Temperature and Environment</h2> <p>Maintain a warm environment with temperatures between 65-85°F (18-30°C). Protect your Monstera from drafts and sudden temperature changes.</p> <h2>6. Fertilization</h2> <p>Feed your Monstera with a balanced, water-soluble fertilizer during the growing season (spring and summer) to promote lush foliage. Follow package instructions for proper dilution and frequency.</p> <h2>7. Pruning and Maintenance</h2> <p>Regularly prune your Monstera to encourage bushy growth and remove any damaged or yellowing leaves. Use clean, sharp scissors to make clean cuts.</p> <h2>8. Potting and Repotting</h2> <p>Choose a well-draining potting mix and repot your Monstera every 1-2 years or when the roots outgrow the container. Select a pot that's slightly larger than the current one.</p>"
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
