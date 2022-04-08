const express = require('express');
const router = express.Router();
const axios = require('axios');
const handleAsync = require('./utils');
const NodeCache = require('node-cache');

// cache wth 1 hour TTL
const cache = new NodeCache({ stdTTL: 60 * 60, checkperiod: 60 * 60 });

router.get('/:city', async (req, res) => {
  const city = req.params.city;

  // check if the city data exists in the cache
  const value = cache.get(city);
  if (value) {
    console.log('mawjoud');
    return res.status(200).json(value);
  }

  // get the lan and lon from the Geocoding API
  const [result1, err1] = await handleAsync(() =>
    axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${'db988691faf182dfc3750cd1e57f3718'}`
    )
  );
  // handle error
  if (err1) return res.status(400).json(err);

  // extract lat and lon
  const lat = result1.data[0]?.lat;
  const lon = result1.data[0]?.lon;

  // get the weather data based on lat and lon
  const [result2, err2] = await handleAsync(() =>
    axios.get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${'db988691faf182dfc3750cd1e57f3718'}`
    )
  );

  // handle error
  if (err2) return res.status(400).json(err2);

  // put the data in the cache
  cache.set(city, result2.data);

  res.status(200).json(result2.data);
});

module.exports = router;
