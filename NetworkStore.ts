import http from "http";
import https from "https";
import HttpError from "metro-cache/src/stores/HttpError";
import NetworkError from "metro-cache/src/stores/NetworkError";
import fetch from "node-fetch";
import url from "url";

import type { Agent as HttpAgent } from "http";
import type { Agent as HttpsAgent } from "https";

export type Options = {
  endpoint: string;
  family?: 4 | 6;
  timeout?: number;
  key?: string | readonly string[] | Buffer | readonly Buffer[];
  cert?: string | readonly string[] | Buffer | readonly Buffer[];
  ca?: string | readonly string[] | Buffer | readonly Buffer[];
};

export class NetworkStore<T> {
  static HttpError: typeof HttpError = HttpError;
  static NetworkError: typeof NetworkError = NetworkError;

  _module: typeof http | typeof https;
  _timeout: number;

  _host: string;
  _port: number;
  _path: string;

  _getAgent: HttpAgent | HttpsAgent;
  _setAgent: HttpAgent | HttpsAgent;

  _url: string;

  constructor(options: Options) {
    this._url = options.endpoint;
    const uri = url.parse(options.endpoint);
    const module = uri.protocol === "http:" ? http : https;

    const agentConfig: http.AgentOptions = {
      family: options.family,
      keepAlive: true,
      keepAliveMsecs: options.timeout || 5000,
      maxSockets: 64,
      maxFreeSockets: 64,
    };

    if (options.key != null) {
      // @ts-expect-error: `key` is missing in the Flow definition
      agentConfig.key = options.key;
    }

    if (options.cert != null) {
      // @ts-expect-error: `cert` is missing in the Flow definition
      agentConfig.cert = options.cert;
    }

    if (options.ca != null) {
      // @ts-expect-error: `ca` is missing in the Flow definition
      agentConfig.ca = options.ca;
    }

    if (!uri.hostname || !uri.pathname) {
      throw new TypeError("Invalid endpoint: " + options.endpoint);
    }

    this._module = module;
    this._timeout = options.timeout || 5000;

    this._host = uri.hostname;
    this._path = uri.pathname;
    this._port = +uri.port;

    this._getAgent = new module.Agent(agentConfig);
    this._setAgent = new module.Agent(agentConfig);
  }

  async get(key: Buffer): Promise<Partial<T>> {
    try {
      const response = await fetch(this._url + "/" + key.toString("hex"));
      if (response.status === 404) {
        return null;
      }
      const json = await response.json();

      //   console.log(json);
      return json;
    } catch (error) {
      console.log("err:", error);
      return null;
    }
  }

  async set(key: Buffer, value: T): Promise<void> {
    const sha = key.toString("hex");
    try {
      //   console.log("set", sha, value as any);
      await fetch(this._url + "/" + sha, {
        body: JSON.stringify(value),
        method: "PUT",
        compress: true,
      });
    } catch (error) {
      console.log("set err:", sha, error, value);
    }
  }

  clear() {
    // Not implemented.
  }
}
