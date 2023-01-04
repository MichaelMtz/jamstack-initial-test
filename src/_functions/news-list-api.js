const axios = require("axios");

exports.handler = async function(event, context, callback) {
  console.log('event:',event);
  const { notPostID } = event.queryStringParameters;
  const url = `https://www.snow-country.com/resorts/api-easy-blog-list.php?notPostID=${notPostID}`;
  const response = await axios.get(url);
  callback(null, {
    statusCode: 200,
    body: JSON.stringify(response.data)
  });
};

