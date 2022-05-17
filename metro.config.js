require("ts-node/register");

// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { NetworkStore } = require("./NetworkStore.ts");

const config = getDefaultConfig(__dirname);

if (!config.cacheStores) config.cacheStores = [];
config.cacheStores.push(
  new NetworkStore({
    endpoint: "http://localhost:3000/api/store",
    family: 4, //6
    timeout: 1000,
  })
);
module.exports = config;
