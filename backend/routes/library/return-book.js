const router = require("express").Router();
const { db } = require("../../utils/database");

const { getTimeStamp } = require("../../functions/generate-timestamp");

router.route("/").post(async (req, res) => {
  const userID = req.body.userID;
  const ISBN = req.body.ISBN;

  await db
    .promise()
    .query(
      `DELETE FROM UserBook WHERE userID = '${userID}' AND ISBN = '${ISBN}'`
    )
    .then(async (response) => {
      if (response[0].affectedRows > 0) {
        await db
          .promise()
          .query(
            `UPDATE Book SET inventory = inventory + 1 WHERE ISBN = '${ISBN}'`
          )
          .catch((err) => {
            console.log(err);
          });

        await db
          .promise()
          .query(
            `INSERT INTO BorrowHistory (userID, ISBN, date, action) VALUES (?, ?, ?, ?)`,
            [userID, ISBN, getTimeStamp(), "RETURNED"]
          )
          .catch((err) => {
            console.log(err);
          });

        res.send({ successMessage: `You have returned: ${ISBN}.` });
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
