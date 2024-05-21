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
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/user1.jpeg',
    avatar: true
  },
  {
    imageableId: 2,
    imageableType: 'User',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/user2.jpeg',
    avatar: true
  },
  {
    imageableId: 3,
    imageableType: 'User',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/user3.jpeg',
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
    imageableId: 10,
    imageableType: 'User',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/user10.jpeg',
    avatar: true
  },
  {
    imageableId: 11,
    imageableType: 'User',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/user11.jpeg',
    avatar: true
  },
  {
    imageableId: 12,
    imageableType: 'User',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/user12.jpeg',
    avatar: true
  },
  {
    imageableId: 13,
    imageableType: 'User',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/user13.jpeg',
    avatar: true
  },
  {
    imageableId: 14,
    imageableType: 'User',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/user14.jpeg',
    avatar: true
  },
  {
    imageableId: 15,
    imageableType: 'User',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/user15.jpeg',
    avatar: true
  },
  {
    imageableId: 16,
    imageableType: 'User',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/user16.jpeg',
    avatar: true
  },
  {
    imageableId: 17,
    imageableType: 'User',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/user17.jpeg',
    avatar: true
  },
  {
    imageableId: 18,
    imageableType: 'User',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/user18.jpeg',
    avatar: true
  },
  {
    imageableId: 19,
    imageableType: 'User',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/user19.jpeg',
    avatar: true
  },
  {
    imageableId: 20,
    imageableType: 'User',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/user20.jpeg',
    avatar: true
  },
  {
    imageableId: 21,
    imageableType: 'User',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/user21.jpeg',
    avatar: true
  },
  {
    imageableId: 22,
    imageableType: 'User',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/user22.jpeg',
    avatar: true
  },
  {
    imageableId: 23,
    imageableType: 'User',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/user23.jpeg',
    avatar: true
  },
  {
    imageableId: 24,
    imageableType: 'User',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/user24.jpeg',
    avatar: true
  },
  {
    imageableId: 25,
    imageableType: 'User',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/user25.jpeg',
    avatar: true
  },
  {
    imageableId: 26,
    imageableType: 'User',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/user26.jpeg',
    avatar: true
  },
  {
    imageableId: 27,
    imageableType: 'User',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/user27.jpeg',
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
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/pppplant.jpeg',
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
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/zzcham.jpeg',
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
    imageableId: 19,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/fiddleleaffig.jpeg',
  },
  {
    imageableId: 20,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/spiderplant.jpeg',
  },
  {
    imageableId: 21,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/monstera.jpeg',
  },
  {
    imageableId: 22,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/zzplant.jpeg',
  },
  {
    imageableId: 23,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/peacelily.jpeg',
  },
  {
    imageableId: 24,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/goldenpothos.jpeg',
  },
  {
    imageableId: 25,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/spiderplant.jpeg',
  },
  {
    imageableId: 26,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/aloevera.jpeg',
  },
  {
    imageableId: 27,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/ficusburgundy.jpeg',
  },
  {
    imageableId: 28,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/jadeplant.jpeg',
  },
  {
    imageableId: 29,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/bostonfern.jpeg',
  },
  {
    imageableId: 30,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/philobrasil.jpeg',
  },
  {
    imageableId: 31,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/birdsnestfern.jpeg',
  },
  {
    imageableId: 32,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/chinesemoneyplant.jpeg',
  },
  {
    imageableId: 33,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/stringofpearls.jpeg',
  },
  {
    imageableId: 34,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/hoyapubicalyx.jpeg',
  },
  {
    imageableId: 35,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/majestypalm.jpeg',
  },
  {
    imageableId: 36,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/bromeliad.jpeg',
  },
  {
    imageableId: 37,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/cactus.jpeg',
  },
  {
    imageableId: 38,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/croton.jpeg',
  },
  {
    imageableId: 39,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/dieffenbachia.jpeg',
  },
  {
    imageableId: 40,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/ficusaudrey.jpeg',
  },
  {
    imageableId: 41,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/luckybamboo.jpeg',
  },
  {
    imageableId: 42,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/maidenhairfern.jpeg',
  },
  {
    imageableId: 43,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/prayerplant.jpeg',
  },
  {
    imageableId: 44,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/oxalis.jpeg',
  },
  {
    imageableId: 45,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/parlorpalm.jpeg',
  },
  {
    imageableId: 46,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/peperomia.jpeg',
  },
  {
    imageableId: 47,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/pitcherplant.jpeg',
  },
  {
    imageableId: 48,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/ponytailpalm.jpeg',
  },
  {
    imageableId: 49,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/purpleheart.jpeg',
  },
  {
    imageableId: 50,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/angelwings.jpeg',
  },
  {
    imageableId: 51,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/satinpothos.jpeg',
  },
  {
    imageableId: 52,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/burrostail.jpeg',
  },
  {
    imageableId: 53,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/staghornfern.jpeg',
  },
  {
    imageableId: 54,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/tradescantiazebrina.jpeg',
  },
  {
    imageableId: 55,
    imageableType: 'Listing',
    url: 'https://plantera.s3.us-west-1.amazonaws.com/public/venusflytrap.jpeg',
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
