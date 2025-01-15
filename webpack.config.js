module.exports = {
  resolve: {
    fallback: {
      "util": require.resolve("util/"),
      "url": require.resolve("url/"),
      "assert": require.resolve("assert/"),
      "buffer": require.resolve("buffer/")
    }
  }
};