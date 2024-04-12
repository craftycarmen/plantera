'use strict';

const { Image } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const imagesList = [
  {
    imageableId: 1,
    imageableType: 'User',
    url: 'https://img.freepik.com/free-vector/woman-wearing-floral-blouse-character_24877-83212.jpg',
    avatar: true
  },
  {
    imageableId: 2,
    imageableType: 'User',
    url: 'https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png',
    avatar: true
  },
  {
    imageableId: 3,
    imageableType: 'User',
    url: 'https://static.vecteezy.com/system/resources/thumbnails/002/002/247/small_2x/beautiful-black-woman-avatar-character-icon-free-vector.jpg',
    avatar: true
  },
  {
    imageableId: 1,
    imageableType: 'Listing',
    url: 'https://images.ctfassets.net/rp89vkans22z/14nRWvVjQ02zgRhsi1ESyz/c5c45b11739f4c69b3258755d292c2ae/AdobeStock_299235619.jpeg',
  },
  {
    imageableId: 2,
    imageableType: 'Listing',
    url: 'https://heyrooted.com/cdn/shop/products/4FICUS_TINEKE-2_a11393e4-e622-4033-a53b-9d4ce121ffff.jpg',
  },
  {
    imageableId: 3,
    imageableType: 'Listing',
    url: 'https://thefernseed.com/cdn/shop/files/IMG_E8512_1024x1024.jpg',
  },
  {
    imageableId: 4,
    imageableType: 'Listing',
    url: 'https://weareplantlovers.com/cdn/shop/files/99022EDA-F5BF-46EE-A167-099FD93B4BCF.jpg',
  },
  {
    imageableId: 1,
    imageableType: 'Guide',
    url: 'https://www.gardendesign.com/pictures/images/900x705Max/site_3/monstera-deliciosa-monstera-houseplant-swiss-cheese-plant-shutterstock-com_16544.jpg',
  },
  {
    imageableId: 2,
    imageableType: 'Guide',
    url: 'https://happyforest.store/wp-content/uploads/2020/02/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20200210152652.png',
  },
  {
    imageableId: 3,
    imageableType: 'Guide',
    url: 'https://cdn.mos.cms.futurecdn.net/4W7J6JbJk7gJNXYLnhpXj9-1920-80.jpg',
  },
]
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await Image.bulkCreate(imagesList, { validate: true })
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Images';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, { [Op.or]: imagesList }, {});
  }
};
