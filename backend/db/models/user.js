'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here

      User.hasMany(
        models.Listing,
        {
          foreignKey: 'sellerId',
          onDelete: 'CASCADE',
          hooks: true
        }
      );

      User.hasMany(
        models.Guide,
        {
          foreignKey: 'userId',
          onDelete: 'CASCADE',
          hooks: true
        }
      );

      User.hasMany(
        models.Image,
        {
          foreignKey: 'imageableId',
          constraints: false,
          scope: {
            imageableType: 'User'
          }
        }
      );
    }
  };

  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 100]
        }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 100]
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 256],
          isEmail: true
        }
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Username cannot be an email");
            }
          }
        }
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      },
      bio: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: {
            args: [30, 250],
            msg: 'Bio must be between 30-250 characters'
          }
        }
      },
      favoritePlant: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: {
            args: [5, 100],
            msg: 'Favorite plant must be between 5-100 characters'
          }
        }
      },
      accountType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 50]
        }
      },
      shopDescription: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: {
            args: [30, 250],
            msg: 'Shop description must be between 30-250 characters'
          }
        }
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [1, 50]
        }
      },
      paymentDetails: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
    },
    {
      sequelize,
      modelName: "User",
      defaultScope: {
        attributes: {
          exclude: ["hashedPassword", "createdAt", "updatedAt"]
        }
      }
    }
  );
  return User;
};
