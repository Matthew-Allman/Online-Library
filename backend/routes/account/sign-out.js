const router = require("express").Router();

// Route to sign user out
//
router.route("/").post(async (req, res) => {
  const userID = req.body.id;

  // Check if user has an active session
  //
  if (req.session.user) {
    // check if session user id matches the user id that was passed on frontend
    //
    if (req.session.user.id === userID) {
      try {
        req.sessionStore.clear();
        res.send({ successMessage: "You have been logged out successfully." });
      } catch (e) {
        res
          .status(500)
          .json("Something went wrong, please refresh and try again.");
      }
    } else {
      res.status(500).json("Something went wrong, please try again.");
    }
  } else {
    res.status(403).json("User must be signed in to perform this request.");
  }
});

module.exports = router;
