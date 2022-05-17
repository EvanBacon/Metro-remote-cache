require("ts-node/register");

// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { NetworkStore } = require("./NetworkStore.ts");
const { AutoCleanFileStore } = require("metro-cache");
const path = require("path");
const fs = require("fs-extra");

const config = getDefaultConfig(__dirname);

const localCache = path.join(__dirname, ".local-metro-cache");

fs.mkdirSync(localCache, { recursive: true });

fs.remove(localCache);

config.cacheStores = [
  new AutoCleanFileStore({
    root: localCache,
    cleanupThresholdMs: 100,
  }),
  new NetworkStore({
    endpoint: "http://localhost:3000/api/store",
    family: 4, //6
    timeout: 1000,
  }),
];
config.cacheStores.push();
module.exports = config;
