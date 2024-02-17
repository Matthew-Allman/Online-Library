const { db } = require("./database");
const { fetchCities } = require("../functions/get-cities");

const propagateCityTable = async () => {
  await db
    .promise()
    .query(`SELECT city FROM AvailableCities`)
    .then(async (response) => {
      if (response[0].length > 0) {
        console.log("\nNo need to fetch city data.");
      } else {
        console.log("Fetching Ontario based cities.\n");

        const elements = await fetchCities();

        if (Array.isArray(elements)) {
          for (elem of elements) {
            const { city, latitude, longitude } = elem;

            await db
              .promise()
              .query(
                `INSERT INTO AvailableCities (city, latitude, longitude) VALUES (?, ?, ?)`,
                [city, latitude, longitude]
              )
              .then((response) => {
                if (response[0].affectedRows > 0) {
                  console.log(`${city} has been inserted.`);
                } else {
                  console.log(`${city} has not been inserted.`);
                }
              })
              .catch(() => {
                console.log(`${city} has not been inserted.`);
              });
          }
        } else {
          console.log("Error fetching the cities.");
        }
      }
    });
};

module.exports = { propagateCityTable };
