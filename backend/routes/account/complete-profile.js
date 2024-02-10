const router = require("express").Router();
const { db } = require("../../utils/database");

router.route("/").post(async (req, res) => {
  const userID = req.body.userID;
  const mailingAddress = req.body.mailingAddress;
  const zipCode = req.body.zipCode;
  const province = req.body.province;
  const city = req.body.city;

  await db
    .promise()
    .query(
      `UPDATE UserInformation SET mailingAddress = '${mailingAddress}', zipCode = '${zipCode}', province = '${province}', city = '${city}' WHERE userID = '${userID}'`
    )
    .then((response) => {
      if (response[0].affectedRows > 0) {
        res.send({ successMessage: "Account information updated." });
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
