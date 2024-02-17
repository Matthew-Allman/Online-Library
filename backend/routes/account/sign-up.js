const router = require("express").Router();
const { db } = require("../../utils/database");
const bcrypt = require("bcrypt");

const Axios = require("axios");

const { generateRandomUserID } = require("../../functions/generate-UUID");

const saltRounds = 10;

router.route("/").post(async (req, res) => {
  const access_token = req.body.access_token;

  if (access_token) {
    const url = `https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,photos,`;
    let firstName = "";
    let lastName = "";
    let email = "";
    let photoURL = "";

    try {
      Axios.default.withCredentials = false;

      await Axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token} `,
        },
      })
        .then((res) => {
          firstName = res.data.names[0].givenName;
          lastName = res.data.names[0].familyName;
          email = res.data.emailAddresses[0].value;
          photoURL = res.data.photos[0].url;
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }

    let exitFlag = false;
    let count = 0;

    let userID = generateRandomUserID();

    while (!exitFlag) {
      await db
        .promise()
        .query(`INSERT INTO User (id, email) VALUES (?, ?)`, [userID, email])
        .then(async (response) => {
          if (response[0].affectedRows > 0) {
            await db
              .promise()
              .query(
                `INSERT INTO UserInformation (userID, firstName, lastName, photoUrl) VALUES (?, ?, ?, ?)`,
                [userID, firstName, lastName, photoURL]
              )
              .then((response) => {
                if (response[0].affectedRows > 0) {
                  res.send({ successMessage: "Account has been created." });
                } else {
                  res.send({
                    errMessage:
                      "There has been an error with the account creation.",
                  });
                }
              })
              .catch((err) => {
                console.log(err);
              });

            exitFlag = true;
          } else {
            res.sendStatus(500);
            exitFlag = true;
          }
        })
        .catch((err) => {
          if (count == 5) {
            res.sendStatus(500);
            exitFlag = true;
          } else {
            if (err.code == "ER_DUP_ENTRY") {
              userID = generateRandomUserID();
              count++;
            } else {
              console.log(err);
              res.sendStatus(500);
              exitFlag = true;
            }
          }
        });
    }
  } else {
    let exitFlag = false;
    let count = 0;

    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    const userID = generateRandomUserID();

    const hash = bcrypt.hashSync(password, saltRounds);

    while (!exitFlag) {
      await db
        .promise()
        .query(`INSERT INTO User (id, email, password) VALUES (?, ?, ?)`, [
          userID,
          email,
          hash,
        ])
        .then(async (response) => {
          if (response[0].affectedRows > 0) {
            await db
              .promise()
              .query(
                `INSERT INTO UserInformation (userID, firstName, lastName) VALUES (?, ?, ?)`,
                [userID, firstName, lastName]
              )
              .then((response) => {
                if (response[0].affectedRows > 0) {
                  res.send({ successMessage: "Account has been created." });
                } else {
                  res.send({
                    errMessage:
                      "There has been an error with the account creation.",
                  });
                }
              })
              .catch((err) => {
                console.log(err);
              });

            exitFlag = true;
          } else {
            res.sendStatus(500);
            exitFlag = true;
          }
        })
        .catch((err) => {
          if (count == 5) {
            res.sendStatus(500);
            exitFlag = true;
          } else {
            if (err.code == "ER_DUP_ENTRY") {
              userID = generateRandomUserID();
              count++;
            } else {
              console.log(err);
              res.sendStatus(500);
              exitFlag = true;
            }
          }
        });
    }
  }
});

module.exports = router;
