const axios = require("axios");

exports.handler = async function(event, context, callback) {
  const {code, state, type, region, pettabs, size, color } = event.queryStringParameters;
  const url = `https://www.snow-country.com/widget/widget_resort.php?code=${code}&state=${state}&type=${type}&region=${region}&pettabs=${pettabs}&size=${size}&color=${color}`;

  const response = await axios.get(url);
  callback(null, {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html",
    },
    body: (url + response.data)
  });
};
