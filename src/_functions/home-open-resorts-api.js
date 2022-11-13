const axios = require("axios");

exports.handler = async function(event, context, callback) {
  const url = `https://feeds.snocountry.net/proof-of-concept/headless-home-open-resorts.php`;
  const response = await axios.get(url);
  callback(null, {
    statusCode: 200,
    body: JSON.stringify(response.data)
  });
};