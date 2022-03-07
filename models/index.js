const Users = require("./user_game");
const UserGameHistory = require("./user_game_history");
const UserGameBiodata = require("./user_game_biodata");
const Room = require("./room");

Users.hasMany(UserGameHistory, {
  foreignKey: "user_game_id",
  as: "user_game_history",
});

UserGameHistory.belongsTo(Users, {
  foreignKey: "user_game_id",
  as: "user_game",
});

Users.hasOne(UserGameBiodata, {
  foreignKey: "user_game_id",
  as: "user_game_biodata",
});

UserGameBiodata.belongsTo(Users, {
  foreignKey: "user_game_id",
  as: "user_game",
});

room.belongsTo(Users, {
  foreignKey: "owned_by",
  as: "owner",
});

room.belongsTo(Users, {
  foreignKey: "player1_uuid",
  as: "player_1",
});

room.belongsTo(Users, {
  foreignKey: "player2_uuid",
  as: "player_2",
});

room.belongsTo(Users, {
  foreignKey: "winner_uuid",
  as: "winner",
});

room.belongsTo(Users, {
  foreignKey: "loser_uuid",
  as: "loser",
});

module.exports = { Users, UserGameHistory, UserGameBiodata, Room };
