'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class useredusessint extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  useredusessint.init({
    uesiid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    userid: DataTypes.UUID,
    eduid: DataTypes.UUID,
    sessid: DataTypes.UUID,
    intid: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'useredusessint',
  });
  return useredusessint;
};