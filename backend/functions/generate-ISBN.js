function generateISBN13() {
  // Generate the first 12 digits randomly
  const prefix = ""; // The prefix for English language books
  const randomDigits = Array.from({ length: 9 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");

  // Calculate the check digit
  const isbnWithoutCheckDigit = prefix + randomDigits;
  const checkDigit = calculateISBN13CheckDigit(isbnWithoutCheckDigit);

  // Combine the parts to form the complete ISBN-13
  const isbn13 = isbnWithoutCheckDigit + checkDigit;

  return isbn13;
}

function calculateISBN13CheckDigit(isbnWithoutCheckDigit) {
  // Convert the ISBN to an array of digits
  const isbnDigits = isbnWithoutCheckDigit.split("").map(Number);

  // Calculate the check digit
  const sum = isbnDigits.reduce(
    (acc, digit, index) => acc + (index % 2 === 0 ? digit : digit * 3),
    0
  );
  const checkDigit = (10 - (sum % 10)) % 10;

  return checkDigit.toString();
}

module.exports = { generateISBN13 };
