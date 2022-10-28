'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class interval extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.sessions, {
        through: "sessint",
        foreignKey: "intid"
      });
      this.belongsToMany(models.Users, {
        through: "useredusessint",
        foreignKey: "intid"
      });
    }
  };
  interval.init({
    intid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
    term: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'interval',
  });
  return interval;
};