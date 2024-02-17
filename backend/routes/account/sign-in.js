const router = require("express").Router();
const { db } = require("../../utils/database");
const bcrypt = require("bcrypt");

const Axios = require("axios");

const { getTimeStamp } = require("../../functions/generate-timestamp");

// Route to send user information to frontend when the user is signed in
// and refreshes the app
//
router.route("/").get(async (req, res) => {
  if (req.session.user) {
    const userID = req.session.user.id;

    // Select the necessary data from the users table
    //
    await db
      .promise()
      .query(`SELECT id, email from User WHERE id = '${userID}'`)
      .then(async (response) => {
        if (response[0].length > 0) {
          let userObj = response[0][0];

          await db
            .promise()
            .query(
              `SELECT * FROM UserInformation WHERE userID = '${userObj.id}'`
            )
            .then((result) => {
              if (result[0].length > 0) {
                delete result[0][0].userID;

                Object.assign(userObj, userObj, result[0][0]);
              }
            })
            .catch(() => {});

          await db
            .promise()
            .query(`SELECT * FROM SignInHistory WHERE userID = '${userObj.id}'`)
            .then((result) => {
              if (result[0].length > 0) {
                delete result[0][0].userID;

                result[0] = result[0].map((item) => {
                  delete item.historyID;
                  delete item.userID;

                  return item;
                });

                userObj.signInHistory = result[0];
              }
            })
            .catch(() => {});

          await db
            .promise()
            .query(
              `SELECT ISBN, status FROM UserBook WHERE userID = '${userObj.id}'`
            )
            .then((response) => {
              if (response[0].length > 0) {
                const books = response[0];

                userObj.books = books;
              }
            })
            .catch((err) => {
              console.log(err);
            });

          req.session.user = userObj;

          // Send loggedIn as true, and the session object with all the users data
          //
          res.send({ loggedIn: true, user: req.session.user });
        } else {
          res.send({
            loggedIn: false,
            user: {},
            errMessage: "User does not exist.",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.send({
          errMessage: "Something went wrong, please try again.",
          loggedIn: false,
        });
      });
  } else {
    res.send({ loggedIn: false, user: {} });
  }
});

// Route to verify if user is autheticated and then create a session for the user
//
router.route("/").post(async (req, res) => {
  let email = req.body.email;
  const password = req.body.password;

  const access_token = req.body.access_token;

  if (access_token) {
    let url = "https://people.googleapis.com/v1/people/me";
    let email;
    try {
      await Axios.get(url, {
        headers: {
          Authorization: `Bearer ${access_token} `,
        },
        params: {
          personFields: "emailAddresses",
        },
      }).then((res) => {
        email = res.data.emailAddresses[0].value;
      });
    } catch (e) {}

    // Select all columns from the users table
    //
    await db
      .promise()
      .query(`SELECT * FROM User WHERE email = '${email}'`)
      .then(async (response) => {
        if (response[0].length > 0) {
          if (response[0][0].password) {
            res.send({
              errMessage:
                "Please log in through your email/password combination.",
            });
          } else {
            delete response[0][0].password;

            let userObj = response[0][0];

            await db
              .promise()
              .query(`INSERT INTO SignInHistory (userID, date) VALUES (?, ?)`, [
                userObj.id,
                getTimeStamp(),
              ])
              .catch((err) => console.log(err));

            await db
              .promise()
              .query(
                `SELECT * FROM UserInformation WHERE userID = '${userObj.id}'`
              )
              .then((result) => {
                if (result[0].length > 0) {
                  delete result[0][0].userID;

                  Object.assign(userObj, userObj, result[0][0]);
                }
              })
              .catch(() => {});

            await db
              .promise()
              .query(
                `SELECT * FROM SignInHistory WHERE userID = '${userObj.id}'`
              )
              .then((result) => {
                if (result[0].length > 0) {
                  delete result[0][0].userID;

                  result[0] = result[0].map((item) => {
                    delete item.historyID;
                    delete item.userID;

                    return item;
                  });

                  userObj.signInHistory = result[0];
                }
              })
              .catch(() => {});

            await db
              .promise()
              .query(`SELECT ISBN FROM UserBook WHERE userID = '${userObj.id}'`)
              .then((response) => {
                if (response[0].length > 0) {
                  const books = response[0].map((item) => {
                    return item.ISBN;
                  });

                  userObj.books = books;
                }
              })
              .catch((err) => {
                console.log(err);
              });

            req.session.user = userObj;

            // Send loggedIn as true, and the session object with all the users data
            //
            res.send({ successMessage: "Login success." });
          }
        } else {
          res.send({
            errMessage: "Please first sign up with Google before logging in.",
          });
        }
      })
      .catch((err) => console.log(err));
  } else {
    if (email) {
      email = email.toLowerCase();
    }

    // Select all columns from the users table
    //
    await db
      .promise()
      .query(`SELECT * FROM User WHERE email = '${email}'`)
      .then((response) => {
        if (response[0].length > 0) {
          const hashedPassword = response[0][0].password;

          // Compare the passwords to authenticate the user
          //
          bcrypt.compare(password, hashedPassword, async (error, result) => {
            if (result) {
              delete response[0][0].password;

              let userObj = response[0][0];

              await db
                .promise()
                .query(
                  `INSERT INTO SignInHistory (userID, date) VALUES (?, ?)`,
                  [userObj.id, getTimeStamp()]
                )
                .catch((err) => console.log(err));

              await db
                .promise()
                .query(
                  `SELECT * FROM UserInformation WHERE userID = '${userObj.id}'`
                )
                .then((result) => {
                  if (result[0].length > 0) {
                    delete result[0][0].userID;

                    Object.assign(userObj, userObj, result[0][0]);
                  }
                })
                .catch(() => {});

              await db
                .promise()
                .query(
                  `SELECT * FROM SignInHistory WHERE userID = '${userObj.id}'`
                )
                .then((result) => {
                  if (result[0].length > 0) {
                    delete result[0][0].userID;

                    result[0] = result[0].map((item) => {
                      delete item.historyID;
                      delete item.userID;

                      return item;
                    });

                    userObj.signInHistory = result[0];
                  }
                })
                .catch(() => {});

              await db
                .promise()
                .query(
                  `SELECT ISBN FROM UserBook WHERE userID = '${userObj.id}'`
                )
                .then((response) => {
                  if (response[0].length > 0) {
                    const books = response[0].map((item) => {
                      return item.ISBN;
                    });

                    userObj.books = books;
                  }
                })
                .catch((err) => {
                  console.log(err);
                });

              req.session.user = userObj;

              // Send loggedIn as true, and the session object with all the users data
              //
              res.send({ successMessage: "Login success." });
            } else {
              res.send({ errMessage: "Incorrect email or password entered." });
            }
          });
        } else {
          res.send({ errMessage: "Incorrect email or password entered." });
        }
      })
      .catch((err) => console.log(err));
  }
});

module.exports = router;
