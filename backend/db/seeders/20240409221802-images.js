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
    imageableId: 4,
    imageableType: 'User',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/person1.jpeg',
    avatar: true
  },
  {
    imageableId: 5,
    imageableType: 'User',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/person2.jpeg',
    avatar: true
  },
  {
    imageableId: 6,
    imageableType: 'User',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/person3.jpeg',
    avatar: true
  },
  {
    imageableId: 7,
    imageableType: 'User',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/person4.jpeg',
    avatar: true
  },
  {
    imageableId: 8,
    imageableType: 'User',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/person5.jpeg',
    avatar: true
  },
  {
    imageableId: 9,
    imageableType: 'User',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/person6.jpeg',
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
    url: 'https://www.epicgardening.com/wp-content/uploads/2020/02/Rhaphidophora-tetrasperma-1200x667.jpg',
  },
  {
    imageableId: 5,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/ppp.jpeg',
  },
  {
    imageableId: 6,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/syngoniumalbo.jpeg',
  },
  {
    imageableId: 7,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/micans.jpeg',
  },
  {
    imageableId: 8,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/lemonlime.jpeg',
  },
  {
    imageableId: 9,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/stringofhearts.jpeg',
  },
  {
    imageableId: 10,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/zzraven.jpg',
  },
  {
    imageableId: 11,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/mojito.jpeg',
  },
  {
    imageableId: 12,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/swiss.jpeg',
  },
  {
    imageableId: 13,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/zebrina.jpeg',
  },
  {
    imageableId: 14,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/hoya.jpeg',
  },
  {
    imageableId: 15,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/ficusshr.jpeg',
  },
  {
    imageableId: 16,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/ZZChameleon.jpeg',
  },
  {
    imageableId: 17,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/marble.jpeg',
  },
  {
    imageableId: 18,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/njoy.jpeg',
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
  {
    imageableId: 4,
    imageableType: 'Guide',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/lighting.jpeg',
  },
  {
    imageableId: 5,
    imageableType: 'Guide',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/soil.jpg',
  },
  {
    imageableId: 6,
    imageableType: 'Guide',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/winterplants.jpeg',
  },
  {
    imageableId: 7,
    imageableType: 'Guide',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/pots.jpeg',
  },
  {
    imageableId: 8,
    imageableType: 'Guide',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/organization.jpeg',
  },
  {
    imageableId: 9,
    imageableType: 'Guide',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/propagation.jpeg',
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
