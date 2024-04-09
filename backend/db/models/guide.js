'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Guide extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Guide.belongsTo(
        models.User,
        {
          foreignKey: 'userId'
        }
      );

      Guide.belongsToMany(
        models.Listing,
        {
          foreignKey: 'listingId'
        }
      )

      Guide.hasMany(
        models.Image,
        {
          foreignKey: 'imageableId',
          constraints: false,
          scope: {
            imageableType: 'Guide'
          }
        }
      );

    }
  }
  Guide.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'User ID is required'
        }
      }
    },
    listingId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Title is required'
        },
        len: {
          args: [5, 30],
          msg: 'Title must be between 5-30 characters'
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
          args: [5, 75],
          msg: 'Description must be between 5-75 characters'
        }
      }
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Content is required'
        },
        len: {
          args: [250, 5000],
          msg: 'Content must be between 250-5000 characters'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Guide',
  });
  return Guide;
};
