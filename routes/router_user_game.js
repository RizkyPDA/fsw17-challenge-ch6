const express = require("express");
const router = express.Router();
const { User_game_biodata, User_game } = require("../models");
const { Users } = require("../models/user_game");

// untuk mendapatkan seluruh data user
router.get("/api/user_game", async (req, res, next) => {
  try {
    const userList = await User_game.findOne({
      // include berfungsi untuk join table sesuai dengan alias (AS) yang sudah didefinisikan di relasi yang ada di file index
      where: { uuid: req.params.id },
      include: ["user_game_biodata", "user_game_history"],
    });
    res.status(200).json({
      message: "SUCCESS",
      data: userList,
    });
  } catch (error) {
    next(error);
  }
});

// create user
router.post("/api/user_game", async (req, res, next) => {
  const { name, email } = req.body;
  // operasi create ini sama dengan
  // INSERT INTO "users" ("uuid","name","email","hobby","status","is_active","age","createdAt","updatedAt")
  // VALUES (uuid, name, email, hobby,status,is_active,age, createdAt, updatedAt) RETURNING
  // "uuid", "name", "email", "hobby", "status", "is_active", "age", "createdAt", "updatedAt";
  try {
    const newUser_game = await User_game.create({
      email,
      name,
    });

    await User_game_biodata.create({
      username: DataTypes.STRING,
      fullname: DataTypes.STRING,
      age: DataTypes.INTEGER,
      address: DataTypes.STRING,
      user_uuid: newUser_game.uuid,
    });

    if (newUser_game) {
      res.status(201).json({
        message: "SUCCESS",
        data: newUser_game,
      });
    } else {
      res.status(400).json({
        message: "FAILED",
      });
    }
  } catch (error) {
    next(error);
  }
});

// edit users
router.put("/api/user_game/:id", async (req, res, next) => {
  const { name, email } = req.body;
  try {
    // ini bentuk panjang
    // await Users.findOne({
    //   where: {
    //     uuid: req.params.id
    //   }
    // })
    const user_gameToUpdate = await User_game.findByPk(req.params.id);
    // jika user yang akan di edit ditemukan
    if (user_gameToUpdate) {
      const user_game_biodataToUpdate = await User_game_biodata.findOne({
        where: {
          user_uuid: req.params.id,
        },
      });
      const updatedBiodata = await user_game_biodataToUpdate.update({
        username,
        fullname,
        age,
        address,
      });
      const updated = await user_gameToUpdate.update({
        // kalau name dari body ada pakai name dari body, kalau tidak pakai name yang sebelumnya sudah ada di db
        username: username ?? user_gameToUpdate.username,
        fullname: fullname ?? user_gameToUpdate.fullname,
        age: age ?? user_gameToUpdate.age,
        address: address ?? user_gameToUpdate.address,
      });
      res.status(200).json({
        message: "SUCCESS",
        data: updated,
      });
    } else {
      res.status(404).json({
        message: "user not found",
      });
    }
  } catch (error) {
    next(error);
  }
});

// delete user
router.delete("/api/user_game/:id", async (req, res, next) => {
  try {
    const userToDelete = await User_game.findByPk(req.params.id);
    // jika user yang akan di edit ditemukan
    if (userToDelete) {
      // delete anaknya dulu baru ortunya
      await User_game_biodata.destroy({
        where: { user_uuid: req.params.id },
      });
      // bentuk sql nya  DELETE FROM "users" WHERE "uuid" = '29b37eb8-8509-498e-837d-db57d8ee2617'
      const deleted = await Users_game.destroy({
        where: {
          uuid: req.params.id,
        },
      });
      // kalau deleted nya sama dengan angka 1 berarti berhasil
      console.log(deleted);
      res.status(200).json({
        message: "SUCCESS",
      });
    } else {
      res.status(404).json({
        message: "user not found",
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
