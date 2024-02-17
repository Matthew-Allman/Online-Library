const router = require("express").Router();
const { db } = require("../../utils/database");

router.route("/").post(async (req, res) => {
  const userID = req.body.userID;
  const ISBN = req.body.ISBN;

  await db
    .promise()
    .query(
      `SELECT status FROM UserBook WHERE userID = '${userID}' AND ISBN = '${ISBN}'`
    )
    .then(async (response) => {
      if (response[0].length > 0) {
        const status = response[0][0].status;

        if (status == "NOT DELIVERED") {
          await db
            .promise()
            .query(
              `DELETE FROM UserBook WHERE userID = '${userID}' AND ISBN = '${ISBN}'`
            )
            .then((result) => {
              if (result[0].affectedRows > 0) {
                res.send({ successMessage: "Item has been deleted." });
              } else {
                res.sendStatus(500);
              }
            })
            .catch((err) => {
              console.log(err);
              res.sendStatus(500);
            });
        } else {
          res.sendStatus(403);
        }
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
