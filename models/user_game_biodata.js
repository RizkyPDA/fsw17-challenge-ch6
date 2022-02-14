const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../utils/databaseConnection");

class User_game_biodata extends Model {}

User_game_biodata.init(
  {
    // Model attributes are defined here
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    age: DataTypes.INTEGER(3),
    address: DataTypes.STRING(255),
    city: DataTypes.STRING(255),
    user_uuid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: "user_game_biodata", // We need to choose the model name,
    freezeTableName: true, // nama tabelnya tidak dirubah jadi bentuk jamak,
    createdAt: true,
    updatedAt: true,
  }
);

module.exports = User_game_biodata;
