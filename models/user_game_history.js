const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../utils/databaseConnection");

class UserGameHistory extends Model {}
UserGameHistory.init(
  {
    // Model attributes are defined here
    uuid: {
      defaultValue: DataTypes.UUIDV4,
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    user_game_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    win: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    lose: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    draw: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: "user_game_history", // We need to choose the model name
    freezeTableName: true,
    createdAt: true,
    updatedAt: false,
  }
);

module.exports = UserGameHistory;
