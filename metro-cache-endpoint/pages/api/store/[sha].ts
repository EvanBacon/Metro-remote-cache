import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import zlib from "zlib";

// Emulate a storage bucket or somn
const cachePath = path.join(__dirname, "../../../../../.cache");
fs.mkdirSync(cachePath, { recursive: true });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = getMethod(req);
  const sha = getFirst<string | undefined>(req.query.sha);

  if (method === "put") {
    console.log("put", sha);
    await fs.promises.writeFile(path.join(cachePath, sha), req.body);
    res.status(200).end();
  } else if (method === "get") {
    if (fs.existsSync(path.join(cachePath, sha))) {
      const buf = await fs.promises.readFile(path.join(cachePath, sha), "utf8");
      console.log("got:", sha);
      // console.log("got:", sha, buf);

      // return zlib stream
      res.status(200).end(buf);
      // res.status(200).end(zlib.gzipSync(buf));
    } else {
      console.log("missing:", sha);
      res.status(404).end();
    }
  } else {
    res.status(404).end();
  }
}

function getFirst<T>(param: undefined | T | T[]): T | undefined {
  if (Array.isArray(param)) {
    return param[0];
  }
  return param;
}
function getMethod(req: NextApiRequest): string {
  // @ts-ignore
  return req.method.toLowerCase();
}
