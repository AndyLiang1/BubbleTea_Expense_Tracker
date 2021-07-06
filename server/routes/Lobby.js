const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { sign } = require("jsonwebtoken");

const { QueryTypes } = require("sequelize");
const { sequelize } = require("../Db");

/**
 * This function adds a user into the database.
 * @param {string} name name of the user
 * @param {string} email email of the user
 * @param {string} hashedPass hashed password
 */
async function addUser(name, email, hashedPass) {
  const result = await sequelize
    .query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", {
      replacements: [name, email, hashedPass],
    })
    .catch((error) => {
      console.log(error);
    });
  return result;
}

/**
 * This function returns an array of the users that match the email provided.
 * If this returned array's length is 0, then the database does not contain
 * a user with that email yet.
 * @param {string} email the email that the database checks to see if it has it already
 */
async function checkEmailExist(email) {
  const users = await sequelize.query("SELECT * FROM users WHERE email = ?", {
    replacements: [email],
    type: QueryTypes.SELECT,
  });
  return users;
}

/**
 * This route registers a user.
 * @body name: name of the user
 * @body email: email of the user
 * @body password: password of the user (will be encrypted)
 */
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const users = await checkEmailExist(email);
  if (users.length === 0) {
    let hashedPass = await bcrypt.hash(password, 10);
    const userWithHashedPass = {
      name: name,
      email: email,
      password: hashedPass,
    };
    const result = await addUser(name, email, hashedPass);
    res.json({ userWithHashedPass: userWithHashedPass, result: result });
  } else {
    res.json({ error: "Email already used!" });
  }
});

/**
 * This route logs a user in
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const users = await checkEmailExist(email);
  if (users.length === 0) {
    res.json({ error: "User does not exist!" });
  } else {
    bcrypt
      .compare(password, users[0].password)
      .then((match) => {
        if (!match) {
          res.json({ error: "Wrong user and pass combo" });
        } else {
          const accessToken = sign(
            { name: users[0].name, id: users[0].id },
            "importantsecret"
          );
          res.json({
            name: users[0].name,
            id: users[0].id,
            token: accessToken,
          });
        }
      })
      .catch((error) => console.log(error));
  }
});

module.exports = router;
