'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class education extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Users, {
        through: "useredu",
        foreignKey: "eduid"
      });
      this.belongsToMany(models.sessions, {
        through: "edusess",
        foreignKey: "eduid"
      });
      this.belongsToMany(models.sessint, {
        through: "edusessint",
        foreignKey: "eduid"
      });
    }
  };
  education.init({
    eduid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
    school: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'education',
  });
  return education;
};