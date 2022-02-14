const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../utils/databaseConnection");

class User_game extends Model {}

User_game.init(
  {
    // Model attributes are defined here
    // firstName: {
    //   type: DataTypes.STRING,
    //   allowNull: false
    // },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      // dengan pesan custom
      unique: {
        msg: "Email Sudah Digunakan",
      },
      // tanpa pesan custom
      // unique: true
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: "user_game", // We need to choose the model name,
    freezeTableName: true, // nama tabelnya tidak dirubah jadi bentuk jamak,
    createdAt: true,
    updatedAt: true,
  }
);

module.exports = User_game;
