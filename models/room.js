const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../utils/databaseConnection");

class Room extends Model {}

Room.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    room_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: {
        msg: "Room Name is Already Used",
      },
    },
    owned_by: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    player1_choices: {
      type: DataTypes.ARRAY(DataTypes.ENUM("ROCK", "PAPER", "SCISSOR")),
    },
    player1_uuid: {
      type: DataTypes.UUID,
    },
    player2_choices: {
      type: DataTypes.ARRAY(DataTypes.ENUM("ROCK", "PAPER", "SCISSOR")),
    },
    player2_uuid: {
      type: DataTypes.UUID,
    },
    winner_uuid: {
      type: DataTypes.UUID,
    },
    loser_uuid: {
      type: DataTypes.UUID,
    },
    draw: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize,
    modelName: "Room",
    freezeTableName: true,
    createdAt: true,
    updatedAt: true,
  }
);

Room.beforeCreate((data) => {
  data.room_name = data.room_name.toLowerCase();
});

Room.beforeUpdate((data) => {
  data.room_name = data.room_name.toLowerCase();
});

module.exports = Room;
