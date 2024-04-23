'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      CartItem.belongsTo(
        models.ShoppingCart,
        {
          foreignKey: 'cartId',
          onDelete: 'SET NULL',
          allowNull: true
        }
      );

      CartItem.belongsTo(
        models.Listing,
        {
          foreignKey: 'listingId'
        }
      );

      // CartItem.belongsTo(models.Order, {
      //   foreignKey: 'orderId',
      //   onDelete: 'SET NULL',
      //   allowNull: true
      // });

    }
  }
  CartItem.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // validate: {
      //   notNull: {
      //     msg: 'Cart ID is required'
      //   }
      // }
    },
    listingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cartQty: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'CartItem',
  });
  return CartItem;
};
