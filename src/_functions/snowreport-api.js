const axios = require("axios");

exports.handler = async function(event, context, callback) {
  const {target,src,type} = event.queryStringParameters;
  const endpoint = (src !== 'resort') ? 'list' : 'resort';     
  const url = `https://feeds.snocountry.net/proof-of-concept/headless-snow-report-${endpoint}.php?target=${target}&src=${src}&type=${type}`;

  const response = await axios.get(url);
  callback(null, {
    statusCode: 200,
    body: JSON.stringify(response.data)
  });
};