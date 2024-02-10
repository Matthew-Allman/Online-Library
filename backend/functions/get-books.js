const Axios = require("axios");

const { generateISBN13 } = require("./generate-ISBN");

const getBooks = async (query) => {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=35`;

  let bookItems = [];

  await Axios.get(url).then((response) => {
    const items = response.data.items;

    if (items.length > 0) {
      items.map((item) => {
        const alphabetRegex =
          /[a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02AF\u1D00-\u1D25\u1D2C-\u1D5C\u1D62-\u1D65\u1D6B-\u1D77\u1D79-\u1DBE\u1E00-\u1EFF]/;
        const volumeInfo = item.volumeInfo;

        let ISBN = volumeInfo.industryIdentifiers
          ? volumeInfo.industryIdentifiers[0].identifier
          : generateISBN13();

        if (alphabetRegex.test(ISBN)) {
          ISBN = generateISBN13();
        }

        const singleObj = {
          ISBN: ISBN,
          title: volumeInfo.title,
          subTitle: volumeInfo.subtitle,
          authors: volumeInfo.authors.join(", "),
          inventory: Math.floor(Math.random() * 3) + 1,
          publisher: volumeInfo.publisher,
          publishedDate: volumeInfo.publishedDate,
          description: volumeInfo.description,
          photoUrl: volumeInfo.imageLinks.thumbnail,
          language: volumeInfo.language,
          previewLink: volumeInfo.previewLink,
        };

        bookItems.push(singleObj);
      });
    }
  });

  return bookItems;
};

module.exports = { getBooks };
