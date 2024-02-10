const router = require("express").Router();
const { db } = require("../../utils/database");

router.route("/").get(async (req, res) => {
  await db
    .promise()
    .query(`SELECT * FROM Book`)
    .then((response) => {
      if (response[0].length > 0) {
        res.send(response[0]);
      } else {
        res.sendStatus(500);
      }
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

module.exports = router;
