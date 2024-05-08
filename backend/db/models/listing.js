'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Listing extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Listing.belongsTo(
        models.User,
        {
          foreignKey: 'sellerId',
          as: 'Seller'
        }
      );

      Listing.hasMany(
        models.Image,
        {
          foreignKey: 'imageableId',
          as: 'ListingImages',
          constraints: false,
          scope: {
            imageableType: 'Listing'
          }
        }
      );

      Listing.belongsToMany(
        models.Guide,
        {
          through: 'ListingGuide',
          foreignKey: 'listingId',
          otherKey: 'guideId',
          optional: true
        }
      )

      Listing.hasMany(
        models.CartItem,
        {
          foreignKey: 'listingId',
          onDelete: 'CASCADE'
        }
      )
    }
  }
  Listing.init({
    sellerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Seller ID is required'
        }
      }
    },
    guideId: {
      type: DataTypes.INTEGER,
      // allowNull: true
    },
    plantName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Plant name is required'
        },
        len: {
          args: [3, 100],
          msg: 'Plant name must be between 3-100 characters'
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Description is required'
        },
        len: {
          args: [30, 250],
          msg: 'Description must be between 30-250 characters'
        }
      }
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Price is required'
        },
        min: {
          args: [1],
          msg: 'Price is invalid'
        },
        isFloat: true
      }
    },
    potSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Pot size is required'
        },
        min: {
          args: [2],
          msg: 'Pot size must be 2 inches or greater'
        },
        isFloat: true
      }
    },
    stockQty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Stock quantity is required'
        },
        // min: {
        //   args: [1],
        //   msg: 'Stock quantity must be greater than 0'
        // },
        isInt: true
      }
    },
  }, {
    sequelize,
    modelName: 'Listing',
  });
  return Listing;
};
