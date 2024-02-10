const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const dotenv = require("dotenv");
dotenv.config();

const { propagateBooktable } = require("./utils/fill-book-table");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);

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

const checkoutBook = require("./routes/library/checkout-book");
app.use("/checkout", checkoutBook);

const returnBook = require("./routes/library/return-book");
app.use("/return", returnBook);

app.listen(process.env.PORT, async () => {
  console.log("Server running on port: " + process.env.PORT);
  await propagateBooktable();
});
