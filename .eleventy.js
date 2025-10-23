module.exports = function(config) {
  config.addFilter("log", (value) => {
      console.log("--- Nunjucks Log ---");
      console.log(value);
      console.log("--------------------");
      return value; // Return the value so the build isn't interrupted
  });
  config.addPassthroughCopy("src/assets");
  return {
    dir: {
      input: "src",
      output: "dist"
    }
  };
};