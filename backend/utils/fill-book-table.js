const { db } = require("./database");
const { getBooks } = require("../functions/get-books");

const propagateBookTable = async () => {
  console.log("\nClearing Book table.");

  await db
    .promise()
    .query(`DELETE FROM Book`)
    .then(() => {
      console.log("Books have been cleared.");
    })
    .catch(() => console.log("Book table does not exist."));

  console.log("\nInserting new data into Book table.\n");

  const books = await getBooks(process.env.GOOGLE_BOOKS_API_QUERY);
  let errorFlag = false;

  if (Array.isArray(books)) {
    for (const book of books) {
      // Depending on the version of your MySQL, this may cause an error on the insertion of some of the characters
      // into the database.
      // The reasoning is that some versions of MySQL do not fully support true utf-8 character encoding.
      // A quick fix would be changing your MySQL version or changing the encoding of the table/database that you are working on.
      //
      await db
        .promise()
        .query(
          `INSERT INTO Book 
           (ISBN, title, subTitle, authors, inventory, publisher, publishedDate, description, photoUrl, language, previewLink)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            book.ISBN,
            book.title,
            book.subTitle,
            book.authors,
            book.inventory,
            book.publisher,
            book.publishedDate,
            book.description ? book.description.toString(8) : "",
            book.photoUrl,
            book.language,
            book.previewLink,
          ]
        )
        .then((response) => {
          if (response[0].affectedRows > 0) {
            console.log(`Book with ISBN: ${book.ISBN} has been added.`);
          } else {
            console.log(`Book with ISBN: ${book.ISBN} has not been added.`);
            errorFlag = true;
          }
        })
        .catch(() => {
          console.log(`\nBook with ISBN: ${book.ISBN} has not been added.\n`);
          errorFlag = true;
        });
    }
    if (errorFlag) {
      console.log("\nThere was an error inserting the books into the table.");
    } else {
      console.log("\nThere were no errors.");
    }
  } else {
    console.log("Error has occurred with Google Books API");
  }
};

module.exports = { propagateBookTable };
