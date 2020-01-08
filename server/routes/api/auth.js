const express = require("express");
const router = express.Router();
const User = require("./../../models/User.js");
const {
  registerValidation,
  loginValidation
} = require("./../../validation.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  // Validating input
  const { error } = registerValidation(req.body);
  if (error)
    return res.send({ type: "Error", message: error.details[0].message });

  // check if exists
  var exists = await User.exists({ username: req.body.username });
  if (exists)
    return res.send({ type: "Error", message: "User already exists!" });

  // hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword
  });
  try {
    const savedUser = await user.save();
    //Create and Assign Token
    const token = jwt.sign(
      {
        _id: savedUser._id,
        username: savedUser.username
      },
      "bkQ8i3FRi2oxnIrq"
    );
    res.header("authtoken", token).send({
      type: "Success",
      message: {
        _id: savedUser._id,
        username: savedUser.username,
        authtoken: token
      }
    });
  } catch (err) {
    res.send({ type: "Error", message: err });
  }
});

router.post("/login", async (req, res) => {
  // Validating input
  const { error } = loginValidation(req.body);
  if (error)
    return res.send({ type: "Error", message: error.details[0].message });

  // check if exists
  var user = await User.findOne({ username: req.body.username });
  if (!user) return res.send({ type: "Error", message: "User doesn't exist!" });
  //check if password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass)
    return res.send({ type: "Error", message: "Invalid Password!" });
  //Create and Assign Token
  const token = jwt.sign(
    { _id: user._id, username: user.username },
    "bkQ8i3FRi2oxnIrq"
  );
  res.header("authtoken", token).send({
    type: "Success",
    message: {
      _id: user._id,
      username: user.username,
      authtoken: token
    }
  });
});

module.exports = router;
