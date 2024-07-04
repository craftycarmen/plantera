'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Review.belongsTo(
        models.Listing,
        {
          foreignKey: 'listingId',
          as: 'Listing'
        }
      )

      Review.belongsTo(
        models.User,
        {
          foreignKey: 'buyerId',
          as: 'Reviewer'
        }
      )

    }
  }
  Review.init({
    listingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Listing ID is required'
        }
      }
    },
    buyerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Buyer ID is required'
        }
      }
    },
    review: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Review is required'
        }
      }
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Star rating is required'
        },
        min: {
          args: [1],
          msg: 'Star rating must be at minimum 1'
        },
        max: {
          args: [5],
          msg: 'Star rating must be at maximum 5'
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
