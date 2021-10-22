const axios = require("axios");

exports.handler = async function(event, context, callback) {
  const {target} = event.queryStringParameters;
  const url = `https://feeds.snocountry.net/proof-of-concept/headless.php?target=${target}`;
  const response = await axios.get(url);
  callback(null, {
    statusCode: 200,
    body: JSON.stringify(response.data)
  });
} 