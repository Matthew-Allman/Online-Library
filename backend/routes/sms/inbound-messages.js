const MessagingResponse = require("twilio").twiml.MessagingResponse;
const {
  deliveredBook,
  canceledDelivery,
} = require("../../functions/delivered-book");
const router = require("express").Router();

router.route("/").post(async (req, res) => {
  const { From, Body } = req.body;
  const twiml = new MessagingResponse();

  try {
    if (Body.includes("Delivered")) {
      const message = await deliveredBook(From, Body);

      twiml.message(message);
      res.writeHead(200, { "Content-Type": "text/xml" });
      res.end(twiml.toString());
    } else if (Body.includes("Cancel")) {
      const message = await canceledDelivery(From, Body);

      twiml.message(message);
      res.writeHead(200, { "Content-Type": "text/xml" });
      res.end(twiml.toString());
    } else {
      twiml.message(
        "Please only send one of the two messages formatted like this:\n\n Delivered <ISBN> <users email> \n Cancel <ISBN> <users email>\n\n\n(e.g. Delivered 9875436532 example@email.com)"
      );

      res.writeHead(200, { "Content-Type": "text/xml" });
      res.end(twiml.toString());
    }
  } catch (e) {
    twiml.message(
      "Please only send one of the two messages formatted like this:\n\n Delivered <ISBN> <users email> \n Cancel <ISBN> <users email>\n\n\n(e.g. Delivered 9875436532 example@email.com)"
    );

    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
  }
});

module.exports = router;
