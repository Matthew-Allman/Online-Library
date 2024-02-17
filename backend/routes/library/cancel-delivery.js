const router = require("express").Router();
const { db } = require("../../utils/database");

const { getTimeStamp } = require("../../functions/generate-timestamp");
const { cancelDelivery } = require("../../functions/send-message");

router.route("/").post(async (req, res) => {
  const userID = req.body.userID;
  const email = req.body.email;
  const ISBN = req.body.ISBN;

  await db
    .promise()
    .query(
      `SELECT DriverID FROM Delivery WHERE userID = '${userID}' AND ISBN = '${ISBN}' AND isComplete = 0`
    )
    .then(async (result) => {
      if (result[0].length > 0) {
        const DriverID = result[0][0].DriverID;
        let phoneNumber = "";

        await db
          .promise()
          .query(
            `SELECT phoneNumber FROM Driver WHERE DriverID = '${DriverID}'`
          )
          .then((response) => {
            if (response[0].length > 0) {
              phoneNumber = response[0][0].phoneNumber;
            }
          })
          .catch(() => {});

        const flag = await cancelDelivery(phoneNumber, ISBN, email);

        if (flag) {
          await db
            .promise()
            .query(
              `UPDATE UserBook SET status = 'CANCELED' WHERE userID = '${userID}' AND ISBN = '${ISBN}' AND status = 'PENDING'`
            )
            .then(async (response) => {
              if (response[0].affectedRows > 0) {
                res.send({
                  successMessage:
                    "The delivery has been canceled. Please refrain from canceling in the future.",
                });

                await db
                  .promise()
                  .query(
                    `INSERT INTO ActionHistory (userID, ISBN, date, action) VALUES (?, ?, ?, ?)`,
                    [userID, ISBN, getTimeStamp(), `CANCELED`]
                  )
                  .catch((err) => {
                    console.log(err);
                  });
              } else {
                res.sendStatus(404);
              }
            })
            .catch((err) => {
              console.log(err);
              res.sendStatus(500);
            });
        } else {
          res.sendStatus(500);
        }
      } else {
        res.send({ errMessage: "This item has alreaby been delivered." });
      }
    });
});

module.exports = router;
