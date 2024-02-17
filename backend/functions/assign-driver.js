const { db } = require("../utils/database");

const assignDriver = async (targetCity) => {
  let returnMessage = "";
  let chosenDriver = {};

  await db
    .promise()
    .query(`SELECT * FROM Driver`)
    .then(async (response) => {
      if (response[0].length > 0) {
        let drivers = response[0];

        let sqlStr = "";

        for (let i = 0; i < drivers.length; i++) {
          const driver = drivers[i];

          if (i == 0) {
            sqlStr += driver.cityID;
          } else {
            sqlStr += ` OR LocationID = ${driver.cityID}`;
          }
        }

        await db
          .promise()
          .query(`SELECT * FROM AvailableCities WHERE LocationID = ${sqlStr}`)
          .then((result) => {
            if (result[0].length > 0) {
              for (let driver of drivers) {
                result[0].map((item) => {
                  if (item.LocationID == driver.cityID) {
                    driver.city = item.city;
                    driver.longitude = item.longitude;
                    driver.latitude = item.latitude;
                  }
                });
              }
            }
          })
          .catch(() => {});

        if (drivers.some((item) => item.city == targetCity)) {
          const foundDrivers = drivers.filter(
            (item) => item.city == targetCity
          );

          if (foundDrivers.length > 1) {
            const lowestValue = { value: 9999, DriverID: "" };

            for (const driver of drivers) {
              await db
                .promise()
                .query(
                  `SELECT DriverID FROM Delivery WHERE DriverID = '${driver.DriverID}'`
                )
                .then((reply) => {
                  if (lowestValue.value > reply[0].length) {
                    lowestValue.value = reply[0].length;
                    lowestValue.DriverID = driver.DriverID;
                  }
                })
                .catch(() => {});
            }

            chosenDriver = foundDrivers.filter(
              (item) => item.DriverID == lowestValue.DriverID
            )[0];
          } else {
            // The driver has been found
            //
            chosenDriver = foundDrivers[0];
          }
        } else {
          let targetObject = {};

          await db
            .promise()
            .query(
              `SELECT city, longitude, latitude FROM AvailableCities WHERE city = '${targetCity}'`
            )
            .then((response) => {
              if (response[0].length > 0) {
                targetObject = response[0][0];
              } else {
                returnMessage =
                  "Could not find the specified users city in the database.";
              }
            })
            .catch(() => {});

          const foundDrivers = sortByDistance(targetObject, drivers);

          if (foundDrivers.length > 1) {
            const lowestValue = { value: 9999, DriverID: "" };

            for (const driver of drivers) {
              await db
                .promise()
                .query(
                  `SELECT DriverID FROM Delivery WHERE DriverID = '${driver.DriverID}'`
                )
                .then((reply) => {
                  if (lowestValue.value > reply[0].length) {
                    lowestValue.value = reply[0].length;
                    lowestValue.DriverID = driver.DriverID;
                  }
                })
                .catch(() => {});
            }

            chosenDriver = foundDrivers.filter(
              (item) => item.DriverID == lowestValue.DriverID
            )[0];
          } else {
            // The driver has been found
            //
            chosenDriver = foundDrivers[0];
          }
        }
      } else {
        returnMessage = "No drivers currently.";
      }
    })
    .catch(() => {});

  return { returnMessage, chosenDriver };
};

// Function to calculate the distance between two points in the world
//
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in kilometers

  const toRadians = (angle) => (angle * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in kilometers

  return distance;
}

function sortByDistance(targetObject, array) {
  const { latitude: targetLat, longitude: targetLon } = targetObject;

  // Calculate distances and add a 'distance' property to each array element
  const elementsWithDistances = array.map((element) => {
    const { latitude, longitude } = element;
    const distance = haversine(
      parseFloat(targetLat),
      parseFloat(targetLon),
      parseFloat(latitude),
      parseFloat(longitude)
    );
    return { ...element, distance };
  });

  // Find the minimum distance
  const minDistance = Math.min(
    ...elementsWithDistances.map((element) => element.distance)
  );

  // Filter elements with the minimum distance
  const closestDrivers = elementsWithDistances.filter(
    (element) => element.distance === minDistance
  );

  return closestDrivers;
}

// assignDriver();
module.exports = { assignDriver };
