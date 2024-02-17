const fetchCities = async () => {
  const username = "cosc3606proj";
  const url = `http://api.geonames.org/searchJSON?country=CA&featureCode=PPL&adminCode1=08&maxRows=1000&username=${username}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data || !data.geonames || data.geonames.length === 0) {
      console.error("No city data retrieved from the API.");
      return;
    }

    const filteredData = data.geonames.filter(
      (item) => item.population > 50000
    );

    if (!filteredData.some((item) => item.name == "Toronto")) {
      filteredData.push({ name: "Toronto", lat: 43.7, lng: -79.42 });
    }

    const returnData = filteredData.map((item) => {
      try {
        const obj = {
          city: item.name,
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lng),
        };

        return obj;
      } catch (e) {}
    });

    return returnData;
  } catch (e) {
    console.log(e);
  }
};

module.exports = { fetchCities };
