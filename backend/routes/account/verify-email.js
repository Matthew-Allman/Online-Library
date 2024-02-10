const router = require("express").Router();
const { db } = require("../../utils/database");

router.route("/").post(async (req, res) => {
  const email = req.body.email;

  if (email) {
    db.query(
      "SELECT email FROM User WHERE email = ?",
      [email],
      (err, result) => {
        if (err) {
          console.log(err);
        } else if (result[0]) {
          res.send({ message: "Email already associated with an account" });
        } else res.send({ validEmail: true });
      }
    );
  } else {
    res.send({ errorMessage: "No email specified" });
  }
});

module.exports = router;
