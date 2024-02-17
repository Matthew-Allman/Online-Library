const router = require("express").Router();
const { db } = require("../../utils/database");

const { getTimeStamp } = require("../../functions/generate-timestamp");

router.route("/").post(async (req, res) => {
  const userID = req.body.userID;
  const ISBN = req.body.ISBN;
  const message = req.body.message;

  await db
    .promise()
    .query(
      `UPDATE UserBook SET status = '${
        message == "yes" ? "RECEIVED" : "NOT RECEIVED"
      }' WHERE userID = '${userID}' AND ISBN = '${ISBN}' AND status = 'DELIVERED'`
    )
    .then(async (response) => {
      if (response[0].affectedRows > 0) {
        if (message == "yes") {
          res.send({ successMessage: "Thank you for the confirmation." });
        } else {
          res.send({
            errMessage:
              "Sorry for the inconvenience. Please verify that your mailing address is correct.",
          });
        }

        await db
          .promise()
          .query(
            `INSERT INTO ActionHistory (userID, ISBN, date, action) VALUES (?, ?, ?, ?)`,
            [
              userID,
              ISBN,
              getTimeStamp(),
              `${message == "yes" ? "RECEIVED" : "NOT RECEIVED"}`,
            ]
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
});

module.exports = router;
