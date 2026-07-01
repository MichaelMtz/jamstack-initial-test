module.exports = function(config) {
  config.addFilter("log", (value) => {
      console.log("--- Nunjucks Log ---");
      console.log(value);
      console.log("--------------------");
      return value; // Return the value so the build isn't interrupted
  });
  config.addPassthroughCopy("src/assets");
  config.addPassthroughCopy({
    "node_modules/lite-youtube-embed/src/lite-yt-embed.css": "assets/vendor/lite-youtube/lite-yt-embed.css",
    "node_modules/lite-youtube-embed/src/lite-yt-embed.js": "assets/vendor/lite-youtube/lite-yt-embed.js",
  });
  return {
    dir: {
      input: "src",
      output: "dist"
    }
  };
};