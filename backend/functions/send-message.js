// Twilio credential keys
//
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Twilio provided phone number
//
const accountPhoneNumber = process.env.TWILIO_ACCOUNT_PHONE_NUMBER;

const client = require("twilio")(accountSid, authToken);

const sendMessage = async (
  fName,
  mailingAddress,
  zipCode,
  city,
  ISBN,
  phoneNumber,
  email
) => {
  let successFlag = false;

  await client.messages
    .create({
      body: `DRIVER: '${fName}',  Book: '${ISBN}', city: '${city}', address: '${mailingAddress}', zipCode: '${zipCode}', email: '${email}'`,
      from: accountPhoneNumber,
      to: phoneNumber,
    })
    .then((message) => {
      if (message.status == "failed") {
        successFlag = false;
      } else {
        successFlag = true;
      }
    });

  return successFlag;
};

const cancelDelivery = async (phoneNumber, ISBN, email) => {
  let flag = false;

  await client.messages
    .create({
      body: `Delivery canceled - ISBN: ${ISBN}, email: ${email}`,
      from: accountPhoneNumber,
      to: phoneNumber,
    })
    .then((message) => {
      if (message.status == "failed") {
        flag = false;
      } else {
        flag = true;
      }
    });

  return flag;
};

module.exports = { sendMessage, cancelDelivery };
