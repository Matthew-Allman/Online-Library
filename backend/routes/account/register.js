const router = require("express").Router();
const { db } = require("../../utils/database");

router.route("/").post(async (req, res) => {
  const name = req.body.name;

  console.log(name);

  await db
    .promise()
    .query(
      `insert into Users SET id = 'deeznuts', email = '${name}', username = '${name}', password = 'hello'`
    )
    .then(() => {
      res.sendStatus(200);
    });
});

module.exports = router;
