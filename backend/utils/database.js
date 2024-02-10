const mysql = require("mysql2");

const database = process.env.MYSQL_DATABASE;
const user = process.env.MYSQL_USER;
const password = process.env.MYSQL_PASSWORD;
const host = process.env.MYSQL_HOSTNAME;

// Create a mysql connection that will be used throughout the backend
//
exports.db = mysql.createConnection({
  host: host,
  user: user,
  password: password,
  database: database,
});

// Create a mysql connection that will be used in this file
//
const con = mysql.createConnection({
  host: host,
  user: user,
  password: password,
  database: database,
  multipleStatements: true,
});

// String to create needed tables if they do not exist
//
let sqlStr = `CREATE TABLE IF NOT EXISTS User (
    id INT NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(100),
    PRIMARY KEY (id),
    UNIQUE INDEX email_UNIQUE (email ASC));`;

sqlStr += `CREATE TABLE IF NOT EXISTS UserInformation (
        userID INT NOT NULL,
        firstName VARCHAR(20) NOT NULL,
        lastName VARCHAR(20) NOT NULL,
        photoUrl TEXT,
        mailingAddress VARCHAR(50),
        zipCode VARCHAR(10),
        province VARCHAR(50),
        city VARCHAR(50),
        PRIMARY KEY (userID),
        FOREIGN KEY(userID) REFERENCES User(id) ON DELETE CASCADE);`;

sqlStr += `CREATE TABLE IF NOT EXISTS SignInHistory (
    historyID INT AUTO_INCREMENT,
    userID INT NOT NULL,
    date VARCHAR(50) NOT NULL,
    PRIMARY KEY (historyID),
    FOREIGN KEY(userID) REFERENCES User(id) ON DELETE CASCADE);`;

sqlStr += `CREATE TABLE IF NOT EXISTS Book (
  ISBN VARCHAR(13) NOT NULL,
  title TEXT NOT NULL,
  subTitle TEXT,
  authors VARCHAR(100) NOT NULL,
  inventory INT NOT NULL,
  publisher TEXT,
  publishedDate VARCHAR(30),
  description TEXT,
  photoUrl TEXT,
  language VARCHAR(5) DEFAULT 'en',
  previewLink TEXT,
  PRIMARY KEY (ISBN)
);`;

sqlStr += `CREATE TABLE IF NOT EXISTS BorrowHistory (
  historyID INT AUTO_INCREMENT,
  userID INT NOT NULL,
  ISBN VARCHAR(13) NOT NULL,
  date VARCHAR(50) NOT NULL,
  action VARCHAR(20) DEFAULT 'CHECKOUT',
  PRIMARY KEY (historyID),
  FOREIGN KEY(ISBN) REFERENCES Book(ISBN) ON DELETE CASCADE,
  FOREIGN KEY(userID) REFERENCES User(id) ON DELETE CASCADE);`;

sqlStr += `CREATE TABLE IF NOT EXISTS UserBook (
  UserBookID INT AUTO_INCREMENT,
  userID INT NOT NULL,
  ISBN VARCHAR(13) NOT NULL,
  PRIMARY KEY (UserBookID),
  FOREIGN KEY(userID) REFERENCES User(id) ON DELETE CASCADE,
  FOREIGN KEY(ISBN) REFERENCES Book(ISBN) ON DELETE CASCADE
);`;

// Create the tables using the sql connection
//
con.connect(async function (err) {
  if (err) throw err;
  var sql = sqlStr;
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else if (result) {
      console.log("No errors occured with creating the tables.\n");
    }
  });
});
