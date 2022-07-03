const axios = require("axios");

exports.handler = async function(event, context, callback) {
  const {target,src} = event.queryStringParameters;
  const endpoint = (src !== 'resort') ? 'list' : 'resort';     
  const prod = `https://feeds.snocountry.net/proof-of-concept/headless-snow-report-${endpoint}.php?target=${target}`;
  const dev = `http://localhost/sno/snoCountryHeadless/snow-reports/headless-snow-report-${endpoint}.php?target=${target}`;
  const url = (window.location.hostname === 'localhost') ? dev: prod; 
  console.log(`--snowreport-api: (${url})`);
  const response = await axios.get(url);
  callback(null, {
    statusCode: 200,
    body: JSON.stringify(response.data)
  });
};