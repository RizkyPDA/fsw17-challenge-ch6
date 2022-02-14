const User_game = require("./user_game");
const User_game_biodata = require("./user_game_biodata");
const User_game_history = require("./user_game_history");

// definisikan relasi
// user punya 1 (hasOne) biodata
// user adalah parent dari biodata

User_game.hasOne(User_game_biodata, {
  foreignKey: "user_uuid",
  as: "user_game_biodata",
});

// biodata adalah kepemilikan dari (belongsTo) users
// biodata adalah children dari user
User_game_biodata.belongsTo(User_game, {
  foreignKey: "user_uuid",
  as: "user_game",
});

// user punya banyak (hasMany) history
// user adalah parent dari history
User_game.hasMany(User_game_history, {
  foreignKey: "user_uuid",
  as: "user_game_history",
});

User_game_history.belongsTo(User_game, {
  foreignKey: "user_uuid",
  as: "user_game",
});

module.exports = {
  User_game,
  User_game_biodata,
  User_game_history,
};
