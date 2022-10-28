'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pivotUserCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  pivotUserCategory.init({
    pivotid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
    userid: DataTypes.UUID,
    catid: DataTypes.UUID,
    parentcatid: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'pivotUserCategory',
  });
  return pivotUserCategory;
};