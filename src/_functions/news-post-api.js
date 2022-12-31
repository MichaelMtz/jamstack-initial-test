const axios = require("axios");

exports.handler = async function(event, context, callback) {
  const params = new URLSearchParams(document.location.search);
  const postID = params.get("postID");
  const url = `https://www.snow-country.com/resorts/api-easy-blog-post.php?postID=${postID}`;
  const response = await axios.get(url);
  callback(null, {
    statusCode: 200,
    body: JSON.stringify(response.data)
  });
};

