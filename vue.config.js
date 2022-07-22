const { defineConfig } = require("@vue/cli-service");
const nodePolyfills = require("node-polyfill-webpack-plugin");

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [new nodePolyfills()],
    // resolve: {
    //   fallback: {
    //     os: false,
    //     url: false,
    //     https: false,
    //     http: false,
    //     crypto: false,
    //     assert: false,
    //     stream: false,
    //   },
    // },
  },
});
