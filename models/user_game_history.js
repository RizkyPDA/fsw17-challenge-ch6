const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../utils/databaseConnection");

class User_game_history extends Model {}

User_game_history.init(
  {
    // Model attributes are defined here
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: DataTypes.STRING,
    login_succeed: DataTypes.INTEGER,
    login_failed: DataTypes.INTEGER,
    win_total: DataTypes.INTEGER,
    lose_total: DataTypes.INTEGER,
    draw_total: DataTypes.INTEGER,
    user_uuid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: "user_game_history", // We need to choose the model name,
    freezeTableName: true, // nama tabelnya tidak dirubah jadi bentuk jamak,
    createdAt: true,
    updatedAt: true,
  }
);

module.exports = User_game_history;
