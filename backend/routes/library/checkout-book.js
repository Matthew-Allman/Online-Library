const router = require("express").Router();
const { db } = require("../../utils/database");

const { getTimeStamp } = require("../../functions/generate-timestamp");

router.route("/").post(async (req, res) => {
  const userID = req.body.userID;
  const ISBN = req.body.ISBN;

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
                await db
                  .promise()
                  .query(`INSERT INTO UserBook (userID, ISBN) VALUES (?, ?)`, [
                    userID,
                    ISBN,
                  ])
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
                          `INSERT INTO BorrowHistory (userID, ISBN, date) VALUES (?, ?, ?)`,
                          [userID, ISBN, getTimeStamp()]
                        )
                        .catch((err) => {
                          console.log(err);
                        });

                      res.send({
                        successMessage: `You have checked out: ${ISBN}.`,
                      });
                    } else {
                      res.sendStatus(500);
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                    res.sendStatus(500);
                  });
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
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

module.exports = router;
