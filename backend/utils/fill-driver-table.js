const { db } = require("./database");
const { drivers } = require("./driver-list");

const propogateDriverTable = async () => {
  console.log("\nChecking Driver table.");

  await db
    .promise()
    .query(`SELECT * FROM Driver`)
    .then(async (response) => {
      if (response[0].length > 0) {
        console.log("No need to insert drivers.");
      } else {
        console.log("\nInserting new data into Driver table.\n");
        let errorFlag = false;

        for (const driver of drivers) {
          await db
            .promise()
            .query(
              `INSERT INTO Driver (cityID, firstName, lastName, phoneNumber) VALUES (?, ?, ?, ?)`,
              [
                driver.city,
                driver.firstName,
                driver.lastName,
                driver.phoneNumber,
              ]
            )
            .then((response) => {
              if (response[0].affectedRows > 0) {
                console.log(`Driver ${driver.firstName} has been added.`);
              } else {
                console.log(`Driver ${driver.firstName} has not been added.`);
                errorFlag = true;
              }
            });
        }

        if (errorFlag) {
          console.log(
            "\nThere was an error inserting the books into the table."
          );
        } else {
          console.log("\nThere were no errors.");
        }
      }
    })
    .catch(() => console.log("Driver table does not exist."));
};

module.exports = { propogateDriverTable };
