const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

// Load .dev.vars
const vars = {};
try {
  const content = fs.readFileSync(path.join(__dirname, "..", ".dev.vars"), "utf8");
  content.split("\n").forEach((line) => {
    const [key, ...rest] = line.split("=");
    if (key && rest.length) vars[key.trim()] = rest.join("=").trim();
  });
} catch {}

const MISTRAL_API_KEY = vars.MISTRAL_API_KEY || process.env.MISTRAL_API_KEY;
const PORT = process.env.PORT || 8787;

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Method not allowed" }));
  }

  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    try {
      const { messages } = JSON.parse(body);
      if (!messages || !Array.isArray(messages)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "messages array required" }));
      }

      const payload = JSON.stringify({ model: "mistral-small-latest", messages });
      const options = {
        hostname: "api.mistral.ai",
        path: "/v1/chat/completions",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MISTRAL_API_KEY}`,
          "Content-Length": Buffer.byteLength(payload),
        },
      };

      const apiReq = https.request(options, (apiRes) => {
        res.writeHead(apiRes.statusCode, { "Content-Type": "application/json" });
        apiRes.pipe(res);
      });

      apiReq.on("error", (err) => {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      });

      apiReq.write(payload);
      apiReq.end();
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Proxy listening on http://0.0.0.0:${PORT}`);
});
