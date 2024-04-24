'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ShoppingCart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      if (models.User) {
        ShoppingCart.belongsTo(
          models.User,
          {
            foreignKey: 'buyerId'
          }
        );
      }

      ShoppingCart.hasMany(
        models.CartItem,
        {
          foreignKey: 'cartId'
        }
      )


    }

  }
  ShoppingCart.init({
    buyerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // validate: {
      //   notNull: {
      //     msg: 'Buyer ID is required'
      //   }
      // }
    },
  }, {
    sequelize,
    modelName: 'ShoppingCart',
  });
  return ShoppingCart;
};
