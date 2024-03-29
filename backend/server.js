const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const dotenv = require("dotenv");
dotenv.config();

const { propagateBookTable } = require("./utils/fill-book-table");
const { propagateCityTable } = require("./utils/fill-cities-table");
const { propogateDriverTable } = require("./utils/fill-driver-table");

const middleware = {
  testFunction: function (req, res, next) {
    const reqUrl = req.originalUrl;

    let condition =
      typeof req.headers.origin === "string"
        ? req.headers.origin.includes(process.env.FRONTEND_URL)
        : false;

    if (condition || reqUrl == "/inbound-messages") {
      next();
    } else {
      res.send({
        status: 403,
        data: "You do not have the correct permissions to use this route.",
      });
    }
  },
};

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);

app.use(middleware.testFunction);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    key: "userID",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.set("json spaces", 3);
process.on("warning", (e) => console.warn(e.stack));

const registration = require("./routes/account/sign-up");
app.use("/sign-up", registration);

const signIn = require("./routes/account/sign-in");
app.use("/sign-in", signIn);

const verifyEmail = require("./routes/account/verify-email");
app.use("/verify-email", verifyEmail);

const signOut = require("./routes/account/sign-out");
app.use("/sign-out", signOut);

const accountDelete = require("./routes/account/account-delete");
app.use("/account-delete", accountDelete);

const completeProfile = require("./routes/account/complete-profile");
app.use("/complete-profile", completeProfile);

const getBooks = require("./routes/library/get-books");
app.use("/get-books", getBooks);

const getCities = require("./routes/library/get-cities");
app.use("/get-cities", getCities);

const checkoutBook = require("./routes/library/checkout-book");
app.use("/checkout", checkoutBook);

const returnBook = require("./routes/library/return-book");
app.use("/return", returnBook);

const inboundMessages = require("./routes/sms/inbound-messages");
app.use("/inbound-messages", inboundMessages);

const confirmation = require("./routes/library/receival-confirmation");
app.use("/receival-confirmation", confirmation);

const cancelDelivery = require("./routes/library/cancel-delivery");
app.use("/cancel-delivery", cancelDelivery);

const clearItem = require("./routes/library/clear-item");
app.use("/clear-item", clearItem);

app.listen(process.env.PORT, async () => {
  console.log("Server running on port: " + process.env.PORT);

  // await propagateBookTable();
  // await propagateCityTable();
  // await propogateDriverTable();
});
