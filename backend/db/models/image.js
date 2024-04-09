'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    getImageable(options) {
      if (!this.imageableType) return Promise.resolve(null);
      const mixinMethodName = `get${this.imageableType}`;
      return this[mixinMethodName](options);
    }

    static associate(models) {
      // define association here

      Image.belongsTo(
        models.Listing,
        {
          foreignKey: 'imageableId',
          constraints: false
        }
      );

      Image.belongsTo(
        models.Guide,
        {
          foreignKey: 'imageableId',
          constraints: false
        }
      );

      Image.belongsTo(
        models.User,
        {
          foreignKey: 'imageableId',
          constraints: false
        }
      );
    }
  }
  Image.init({
    imageableId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    imageableType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    avatar: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};
