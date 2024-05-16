'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ListingGuide extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ListingGuide.belongsTo(models.Listing, {
        foreignKey: 'listingId',
        onDelete: 'CASCADE'
      });

      ListingGuide.belongsTo(models.Guide, {
        foreignKey: 'guideId',
        onDelete: 'CASCADE'
      })
    }
  }
  ListingGuide.init({
    listingId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    guideId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'ListingGuide',
  });
  return ListingGuide;
};
