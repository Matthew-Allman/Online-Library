// Returns current time stamp formatted
//
const getTimeStamp = () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = new Date().getMonth();
  let hour = new Date().getHours();
  if (hour < 10) {
    hour = "0" + hour;
  }
  let min = new Date().getMinutes();
  if (min < 10) {
    min = "0" + min;
  }
  const date =
    months[month] +
    " " +
    new Date().getDate() +
    ", " +
    new Date().getFullYear() +
    " at " +
    hour +
    ":" +
    min;

  return date;
};

module.exports = { getTimeStamp };
