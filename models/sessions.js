'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class sessions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.interval, {
        through: "sessint",
        foreignKey: "sessid"
      });
      this.belongsToMany(models.education, {
        through: "edusess",
        foreignKey: "sessid"
      });
      this.belongsToMany(models.Users, {
        through: "useredusessint",
        foreignKey: "sessid"
      });
    }
  };
  sessions.init({
    sessid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
    section: DataTypes.STRING,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'sessions',
  });
  return sessions;
};