import fetch from "node-fetch";

(async () => {
  // fetch the react native bundle
  console.log("Fetching manifest");
  const results = await fetch("http://localhost:19000/").then((res) =>
    res.json()
  );

  console.log("Fetching bundle");
  console.time("fetch-bundle");
  const bundle = await fetch(results.bundleUrl).then((res) => res.text());
  console.timeEnd("fetch-bundle");
  console.log("Fetched bundle: ", bundle.length);
})();
