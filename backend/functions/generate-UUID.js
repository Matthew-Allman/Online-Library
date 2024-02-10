function generateRandomUserID() {
  // Assuming a userID is a positive integer
  const min = 1000; // Minimum value for userID
  const max = 9999; // Maximum value for userID

  // Generate a random integer between min and max (inclusive)
  const randomUserID = Math.floor(Math.random() * (max - min + 1)) + min;

  return randomUserID;
}

module.exports = { generateRandomUserID };
