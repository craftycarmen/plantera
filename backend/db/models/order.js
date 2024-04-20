'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Order.belongsTo(
        models.User,
        {
          foreignKey: 'buyerId'
        }
      )

      Order.belongsTo(
        models.ShoppingCart,
        {
          foreignKey: 'cartId'
        }
      )
    }
  }
  Order.init({
    buyerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Buyer ID is required'
        }
      }
    },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Cart ID is required'
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Address is required'
        }
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'City is required'
        }
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'State is required'
        }
      }
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'ZIP code is required'
        }
      }
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Payment method is required'
        }
      }
    },
    paymentDetails: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Payment details is required'
        }
      }
    },
    orderTotal: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Order total is required'
        }
      }
    },
    orderStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Processing",
      validate: {
        notNull: {
          msg: 'Order status is required'
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};