const axios = require("axios");

exports.handler = async function(event, context, callback) {
  const { resort_id } = event.queryStringParameters;
  //const url = `https://feeds.snocountry.net/proof-of-concept/headless-snow-report-${endpoint}.php?target=${target}`;
  const url = `https://feeds.snocountry.net/archiveChartSaved.php?resort_id=${resort_id}`;

  const response = await axios.get(url);
  callback(null, {
    statusCode: 200,
    body: JSON.stringify(response.data)
  });
};