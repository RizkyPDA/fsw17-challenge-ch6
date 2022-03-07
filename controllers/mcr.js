const { Users, UserGameHistory, UserGameBiodata, Room } = require("../models");
const { Op } = require("sequelize");
const fs = require("fs");
const bcrypt = require("bcrypt");
const errorHandler = require("../utils/error");
const jwt = require("jsonwebtoken");
const { redirect } = require("express/lib/response");

/**
 * Register User API
 */
const Register = async (req, res, next) => {
  try {
    const { fullname, username, email, role, password1, password2 } = req.body;
    // check apakah password dan confirm passwordnya sama
    if (password1 !== password2) {
      //return errorHandler(400, "Password yang anda masukkan tidak cocok", res);
      res.redirect("/register");
    } else {
      // hash password user
      const hashedPassword = await bcrypt.hash(password1, 10);

      // create new user
      const newUser = await Users.create({
        fullname,
        username,
        email,
        role_id: 2,
        password: hashedPassword,
      });

      console.log("new user", newUser);

      // create user bio after user created
      await UserGameBiodata.create({
        fullname,
        user_game_id: newUser.uuid,
      });

      // create user history after user created
      await UserGameHistory.create({
        user_game_id: newUser.uuid,
      });

      // res.json({
      //   message: "User Created SuccessFully",
      // });
      res.redirect("/login");
    }
  } catch (error) {
    //return errorHandler(500, error.message, res);
    console.log("catch register", error);
    res.redirect("/register");
  }
};

const API_Register = async (req, res, next) => {
  try {
    const { fullname, username, email, role_id, password } = req.body;
    // hash password user
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const newUser = await Users.create({
      fullname,
      username,
      email,
      role_id,
      password: hashedPassword,
    });

    console.log("new user", newUser);

    // create user bio after user created
    await UserGameBiodata.create({
      fullname,
      user_game_id: newUser.uuid,
    });

    // create user history after user created
    await UserGameHistory.create({
      user_game_id: newUser.uuid,
    });

    res.json({
      message: "User Created SuccessFully",
    });
  } catch (error) {
    //return errorHandler(500, error.message, res);
    console.log("catch register", error);
    res.json({
      message: "User Created Failed",
    });
  }
};
/**
 * Login User API
 */
const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // check request buat parameter yang kosong
    if (!email) {
      req.flash("error", "Email tidak boleh kosong");
    }

    if (!password) {
      req.flash("error", "Password tidak boleh kosong");
    }

    // check user dengan email yang sama yang di input oleh user
    const user = await Users.findOne({
      where: {
        // kasih kondisi email yang sudah dikecilin hurufnya
        email: email.toLowerCase(),
      },
    });

    const passwordIsValid = await bcrypt.compareSync(password, user.password);

    // check password yang di db dengan yang di input
    if (passwordIsValid) {
      // kunci data user menggunakan jwt
      let token = jwt.sign(
        {
          user_id: user.uuid,
          role: user.role_id,
          name: user.fullname,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: 86400, // 24 jam
        }
      );
      res.cookie("jwt", token, { maxAge: 1000 * 60 * 60 * 24 });
      res.redirect("/dashboard");
    } else {
      // kalau user tidak ada dan password salah kasih error
      req.flash("error", "Email atau Password salah");
      res.redirect("/login");
    }
  } catch (error) {
    console.log("=============LOGIN==================");
    console.log(error);
    console.log("=============LOGIN==================");
    // req.flash("error", "Email atau Password salah");
    res.redirect("/login");
    //return errorHandler(500, error.message, res);
  }
};

const CreateRoom = async (req, res, next) => {
  try {
    const roomName = req.body.room_name;
    const user = req.user;

    if (!roomName) {
      return errorHandler(400, "Please Input Room Name", res);
    }

    const newRoom = await Room.create({
      room_name: roomName,
      owned_by: user.user_id,
    });

    res.status(201).json({
      status: "SUCCESS",
      message: "New Room Created",
      room_name: newRoom.room_name,
    });
  } catch (error) {
    console.log("=============CREATEROOM==================");
    console.log(error);
    console.log("=============CREATEROOM==================");
    return errorHandler(500, error.message, res);
  }
};

const PlayGameRoom = async (req, res, next) => {
  try {
    const playerChoices = req.body.choices;
    const room = req.body.room_name;

    if (!playerChoices) {
      return errorHandler(400, "Please Input Your Choice", res);
    }
    // check choices dari user bentuk datanya array atau bukan
    if (!Array.isArray(playerChoices)) {
      return errorHandler(400, "Please Input Your Choice In Array", res);
    }
    // user harus milih 3 rock paper scissor dalam satu array
    if (playerChoices.length != 3) {
      return errorHandler(400, "Please Input 3 Choice", res);
    }
    // kalau room nya gak di input error
    if (!room) {
      return errorHandler(400, "Please Insert Room Name", res);
    }

    const foundRoom = await Room.findOne({
      where: {
        room_name: room.toLowerCase(),
      },
    });

    if (!foundRoom) {
      return errorHandler(404, "ROOM NOT FOUND", res);
    } else {
      // kalau player 1 slot nya masih kosong
      // maka player yang posting rps duluan jadi player 1
      if (!foundRoom.player_1_uuid) {
        await foundRoom.update({
          player_1_choices: playerChoices,
          player_1_uuid: req.user.user_id,
        });
      } else if (!foundRoom.player_2_uuid) {
        // karena player 1 udah diisi jadi player sekarang jadi player
        await foundRoom.update({
          player_2_choices: playerChoices,
          player_2_uuid: req.user.user_id,
        });
      } else {
        return errorHandler(400, "Room is already full", res);
      }
    }

    // check apakah seluruh player sudah milih rps
    if (foundRoom.player_1_choices && foundRoom.player_2_choices) {
      // user history
      const user1History = await User_History.findOne({
        where: {
          user_uuid: foundRoom.player_1_uuid,
        },
      });
      const user2History = await User_History.findOne({
        where: {
          user_uuid: foundRoom.player_2_uuid,
        },
      });
      // score awal player
      let player1Score = 0;
      let player2Score = 0;

      for (const index in foundRoom.player_1_choices) {
        // pilihan player 1 pada saat looping ke n
        const player1Choice = foundRoom.player_1_choices[index];
        const player2Choice = foundRoom.player_2_choices[index];

        // concat / gabungkan string dari pilihan kedua player contoh ROCKROCK, PAPERSCISSOR
        const playersChoice = `${player1Choice}${player2Choice}`;

        switch (playersChoice) {
          case "ROCKROCK":
            player1Score += 1;
            player2Score += 1;
            break;
          case "ROCKPAPER":
            player2Score += 1;
            break;
          case "ROCKSCISSOR":
            player1Score += 1;
            break;
          case "PAPERROCK":
            player1Score += 1;
            break;
          case "PAPERPAPER":
            player1Score += 1;
            player2Score += 1;
            break;
          case "PAPERSCISSOR":
            player2Score += 1;
            break;
          case "SCISSORROCK":
            player2Score += 1;
            break;
          case "SCISSORPAPER":
            player1Score += 1;
            break;
          case "SCISSORSCISSOR":
            player1Score += 1;
            player2Score += 1;
            break;
          default:
            break;
        }
      }

      // check kondisi kemenangan berdasarkan score
      if (player1Score > player2Score) {
        // player 1 win
        // update history player satu tambah nilai win nya 1
        await user1History.update({
          win: Number(user1History.win) + 1,
        });
        // update history player 2 tambah nilai lose nya 1
        await user2History.update({
          lose: Number(user2History.lose) + 1,
        });
        // update hasil pertandingan ke room
        await foundRoom.update({
          winner_uuid: foundRoom.player_1_uuid,
          loser_uuid: foundRoom.player_2_uuid,
          draw: false,
        });
        res.status(200).json({
          message: "PLAYER 1 WIN",
        });
      } else if (player2Score > player1Score) {
        await user1History.update({
          lose: Number(user1History.lose) + 1,
        });
        await user2History.update({
          win: Number(user2History.win) + 1,
        });
        await foundRoom.update({
          winner_uuid: foundRoom.player_2_uuid,
          loser_uuid: foundRoom.player_1_uuid,
          draw: false,
        });
        res.status(200).json({
          message: "PLAYER 2 WIN",
        });
      } else {
        await user1History.update({
          draw: Number(user1History.draw) + 1,
        });
        await user2History.update({
          draw: Number(user2History.draw) + 1,
        });
        await foundRoom.update({
          draw: true,
        });
        res.status(200).json({
          message: "DRAW",
        });
      }
      // jika hanya baru satu player yang milih
    } else {
      res.status(200).json({
        message: "Your Choices Recorded, Wait For Player 2 To Choose",
      });
    }
  } catch (error) {
    console.log("=============CREATEROOM==================");
    console.log(error);
    console.log("=============CREATEROOM==================");
    return errorHandler(500, error.message, res);
  }
};

module.exports = {
  Register,
  Login,
  CreateRoom,
  PlayGameRoom,
  API_Register,
};
