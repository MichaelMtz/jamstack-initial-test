const axios = require("axios");

exports.handler = async function(event, context, callback) {
  const {target,src} = event.queryStringParameters;
  let endpoint = (src !== 'resort') ? 'list' : 'resort';     
  const url = `https://feeds.snocountry.net/proof-of-concept/headless-snow-report-${endpoint}.php?target=${target}`;
  const response = await axios.get(url);
  callback(null, {
    statusCode: 200,
    body: JSON.stringify(response.data)
  });
} 