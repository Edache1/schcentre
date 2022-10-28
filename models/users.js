'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.userCategory, {
        through: "pivotusercategories",
        foreignKey: "userid"
      });
      this.hasMany(models.userDocs, {
        foreignKey: "userid"
      });
      this.belongsToMany(models.education, {
        through: "useredu",
        foreignKey: "userid"
      });
      this.belongsToMany(models.sessions, {
        through: "useredusessint",
        foreignKey: "userid"
      });
      this.belongsToMany(models.interval, {
        through: "useredusessint",
        foreignKey: "userid"
      });
    }
  };
  Users.init({
    userid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    folpath: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};