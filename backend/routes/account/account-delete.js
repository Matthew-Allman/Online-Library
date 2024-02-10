const router = require("express").Router();
const { db } = require("../../utils/database");

router.route("/").post(async (req, res) => {
  const userID = req.body.id;

  await db
    .promise()
    .query(`SELECT ISBN FROM UserBook WHERE userID = '${userID}'`)
    .then(async (response) => {
      if (response[0].length > 0) {
        res.send({
          errMessage:
            "Please return all borrowed books before deleting your account.",
        });
      } else {
        await db
          .promise()
          .query(`DELETE FROM User WHERE id = '${userID}'`)
          .then((result) => {
            if (result[0].affectedRows) {
              res.send({
                status: 200,
                successMessage: "Your account has been deleted.",
              });
            } else {
              res.sendStatus(500);
            }
          })
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
