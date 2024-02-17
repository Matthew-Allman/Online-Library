const router = require("express").Router();
const { db } = require("../../utils/database");

const { getTimeStamp } = require("../../functions/generate-timestamp");
const { assignDriver } = require("../../functions/assign-driver");
const { sendMessage } = require("../../functions/send-message");

router.route("/").post(async (req, res) => {
  const userID = req.body.userID;
  const email = req.body.email;
  const ISBN = req.body.ISBN;

  const mailingAddress = req.body.mailingAddress;
  const zipCode = req.body.zipCode;
  const city = req.body.city;

  await db
    .promise()
    .query(
      `SELECT ISBN FROM UserBook WHERE ISBN = '${ISBN}' AND userID = '${userID}'`
    )
    .then(async (response) => {
      if (response[0].length > 0) {
        res.send({
          errMessage: "You can not be in possession of the same book.",
        });
      } else {
        await db
          .promise()
          .query(`SELECT inventory FROM Book WHERE ISBN = '${ISBN}'`)
          .then(async (response) => {
            if (response[0].length > 0) {
              const inventory = response[0][0].inventory;

              if (inventory > 0) {
                const { returnMessage, chosenDriver } = await assignDriver(
                  city
                );

                if (Object.values(chosenDriver).length > 0) {
                  let successFlag = false;

                  await db
                    .promise()
                    .query(
                      `INSERT INTO Delivery (DriverID, ISBN, userID) VALUES (?, ?, ?)`,
                      [chosenDriver.DriverID, ISBN, userID]
                    )
                    .then(async (response) => {
                      if (response[0].affectedRows > 0) {
                        successFlag = await sendMessage(
                          chosenDriver.firstName,
                          mailingAddress,
                          zipCode,
                          city,
                          ISBN,
                          chosenDriver.phoneNumber,
                          email
                        );
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                    });

                  if (successFlag) {
                    await db
                      .promise()
                      .query(
                        `INSERT INTO UserBook (userID, ISBN) VALUES (?, ?)`,
                        [userID, ISBN]
                      )
                      .then(async (result) => {
                        if (result[0].affectedRows > 0) {
                          await db
                            .promise()
                            .query(
                              `UPDATE Book SET inventory = inventory - 1 WHERE ISBN = '${ISBN}'`
                            )
                            .catch((err) => {
                              console.log(err);
                            });

                          await db
                            .promise()
                            .query(
                              `INSERT INTO ActionHistory (userID, ISBN, date) VALUES (?, ?, ?)`,
                              [userID, ISBN, getTimeStamp()]
                            )
                            .catch((err) => {
                              console.log(err);
                            });
                        } else {
                          res.sendStatus(500);
                        }
                      })
                      .catch((err) => {
                        console.log(err);
                      });

                    res.send({
                      successMessage: `${ISBN} will be delievered shortly, check your My Books portal for updates.`,
                    });
                  } else {
                    res.sendStatus(500);

                    await db
                      .promise()
                      .query(
                        `DELETE FROM Delivery WHERE DriverID = '${chosenDriver.DriverID}' AND ISBN = '${ISBN}' AND userID = '${userID}'`
                      )
                      .catch((err) => {
                        console.log(err);
                      });
                  }
                } else {
                  res.send({ errMessage: returnMessage });
                }
              } else {
                res.send({
                  errMessage:
                    "This book is out of stock, please try again later.",
                });
              }
            } else {
              res.sendStatus(404);
            }
          })
          .catch((err) => {
            console.log(err);
            res.send({ errMessage: "Something went wrong, please try again." });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

module.exports = router;
