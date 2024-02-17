const { db } = require("../utils/database");
const { getTimeStamp } = require("./generate-timestamp");

const deliveredBook = async (phoneNumber, message) => {
  let returnMessage = "Error parsing your message. Please try again";

  try {
    let splitMessage = message.split(" ");

    if (Array.isArray(splitMessage)) {
      splitMessage = splitMessage.filter((item) => item);

      if (splitMessage.length == 3) {
        const ISBN = splitMessage[1];
        const email = splitMessage[2];

        await db
          .promise()
          .query(
            `UPDATE UserBook, User SET UserBook.status = 'DELIVERED'
        WHERE User.email = '${email}' AND UserBook.userID = User.id AND ISBN = '${ISBN}'`
          )
          .then(async (response) => {
            if (response[0].affectedRows > 0) {
              const subQuery = `SELECT id FROM User WHERE email = '${email}'`;
              const subQuery1 = `SELECT DriverID FROM Driver WHERE phoneNumber = '${phoneNumber}'`;

              await db
                .promise()
                .query(
                  `UPDATE Delivery SET isComplete = 1 WHERE userID = (${subQuery}) AND ISBN = '${ISBN}' AND DriverID = (${subQuery1})`
                )
                .catch((err) => {
                  console.log(err);
                });

              await db
                .promise()
                .query(
                  `INSERT INTO ActionHistory SET userID = (${subQuery}), ISBN = '${ISBN}', date = '${getTimeStamp()}', action = 'DELIVERED'`
                )
                .catch((err) => {
                  console.log(err);
                });

              returnMessage = "Thank you for the delivery.";
            }
          })
          .catch(() => {});
      }
    }
  } catch (e) {
    returnMessage =
      "Please formt your message as:\n Delivered <ISBN> <users email>\n(e.g. Delivered 9875436532 example@email.com).";
  }

  return returnMessage;
};

const canceledDelivery = async (phoneNumber, message) => {
  let returnMessage = "Error parsing your message. Please try again";

  try {
    let splitMessage = message.split(" ");

    if (Array.isArray(splitMessage)) {
      splitMessage = splitMessage.filter((item) => item);

      if (splitMessage.length == 3) {
        const ISBN = splitMessage[1];
        const email = splitMessage[2];

        await db
          .promise()
          .query(
            `UPDATE UserBook, User SET UserBook.status = 'NOT DELIVERED'
        WHERE User.email = '${email}' AND UserBook.userID = User.id AND ISBN = '${ISBN}'`
          )
          .then(async (response) => {
            if (response[0].affectedRows > 0) {
              const subQuery = `SELECT id FROM User WHERE email = '${email}'`;

              await db
                .promise()
                .query(
                  `INSERT INTO ActionHistory SET userID = (${subQuery}), ISBN = '${ISBN}', date = '${getTimeStamp()}', action = 'NOT DELIVERED'`
                )
                .catch((err) => {
                  console.log(err);
                });

              returnMessage = `Delivery to ${email} has been canceled.`;
            }
          })
          .catch(() => {});
      }
    }
  } catch (e) {}

  return returnMessage;
};

module.exports = { deliveredBook, canceledDelivery };
