const axios = require("axios");

exports.handler = async function(event, context, callback) {
  const {resortId} = event.queryStringParameters;
  const url = `https://good-cormorant-17.convex.site/api/resort-data?resortId=${resortId}`;

  const response = await axios.get(url);
  callback(null, {
    statusCode: 200,
    body: JSON.stringify(response.data)
  });
};