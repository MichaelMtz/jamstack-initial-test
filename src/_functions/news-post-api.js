const axios = require("axios");

exports.handler = async function(event, context, callback) {
  console.log('event:',event);
  const { postID } = event.queryStringParameters;
  const url = `https://www.snow-country.com/resorts/api-easy-blog-post.php?postID=${postID}`;
  const response = await axios.get(url);
  callback(null, {
    statusCode: 200,
    body: JSON.stringify(response.data)
  });
};

