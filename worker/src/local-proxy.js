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
const GOOGLE_PLACES_API_KEY = vars.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_PLACES_API_KEY;
const PORT = process.env.PORT || 8787;

// Lightweight dish extraction from review text (JS port of extractDishes.ts)
const DISH_PATTERNS = [
  /\bthe\s+([A-Za-z][A-Za-z' ]{1,30}?)\s+(?:was|is|are|were)\s+(?:amazing|incredible|delicious|fantastic|excellent|great|good|perfect|outstanding|superb|divine|wonderful|tasty|fresh|tender|crispy|juicy|savory)/gi,
  /\bloved?\s+the\s+([A-Za-z][A-Za-z' ]{1,30}?)(?:\s*[.!,;]|\s+and\b|\s+but\b|$)/gi,
  /\btry\s+the\s+([A-Za-z][A-Za-z' ]{1,30}?)(?:\s*[.!,;]|\s+and\b|\s+but\b|$)/gi,
  /\bordered\s+the\s+([A-Za-z][A-Za-z' ]{1,30}?)(?:\s*[.!,;]|\s+and\b|$)/gi,
  /\brecommend\s+the\s+([A-Za-z][A-Za-z' ]{1,30}?)(?:\s*[.!,;]|\s+and\b|$)/gi,
  /\bknown\s+for\s+(?:its?\s+|the\s+)?([A-Za-z][A-Za-z' ]{1,30}?)(?:\s*[.!,;]|\s+and\b|$)/gi,
  /\bmust[- ]try\s+(?:is\s+the\s+|the\s+)?([A-Za-z][A-Za-z' ]{1,30}?)(?:\s*[.!,;]|\s+and\b|$)/gi,
];
const STOP_WORDS = new Set(["food","place","restaurant","service","staff","experience","atmosphere","ambiance","vibe","decor","location","price","prices","menu","portion","portions","meal","dinner","lunch","breakfast","brunch","wait","waiter","waitress","server","table","view","music","owner","chef","everything","something","anything","nothing","thing","spot","joint","eatery","establishment"]);

function extractDishesFromText(text) {
  const found = [];
  for (const pattern of DISH_PATTERNS) {
    pattern.lastIndex = 0;
    let m;
    while ((m = pattern.exec(text)) !== null) {
      const dish = m[1].trim();
      if (dish.length >= 3) {
        const words = dish.toLowerCase().split(/\s+/);
        if (!words.every(w => STOP_WORDS.has(w))) {
          found.push(dish.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" "));
        }
      }
    }
  }
  return found;
}

function extractDishes(reviews, editorialSummary) {
  const all = [];
  if (editorialSummary) all.push(...extractDishesFromText(editorialSummary));
  const sorted = [...(reviews || [])].sort((a, b) => b.rating - a.rating);
  for (const r of sorted) {
    if (r.text?.text) all.push(...extractDishesFromText(r.text.text));
  }
  const seen = new Set();
  const unique = [];
  for (const d of all) {
    const key = d.toLowerCase();
    if (!seen.has(key)) { seen.add(key); unique.push(d); }
    if (unique.length >= 5) break;
  }
  return unique;
}

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  // GET /places — Google Places proxy
  if (req.method === "GET" && parsedUrl.pathname === "/places") {
    const name = parsedUrl.searchParams.get("name");
    const city = parsedUrl.searchParams.get("city");

    if (!name || !city) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Missing required query parameters: name and city" }));
    }

    const payload = JSON.stringify({ textQuery: `${name} ${city}` });
    const options = {
      hostname: "places.googleapis.com",
      path: "/v1/places:searchText",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
        "X-Goog-FieldMask": "places.rating,places.userRatingCount,places.editorialSummary,places.reviews",
        "Content-Length": Buffer.byteLength(payload),
      },
    };

    const apiReq = https.request(options, (apiRes) => {
      let data = "";
      apiRes.on("data", (chunk) => (data += chunk));
      apiRes.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          const place = parsed.places?.[0];
          const result = {
            rating: place?.rating ?? null,
            userRatingCount: place?.userRatingCount ?? null,
            dishes: extractDishes(place?.reviews, place?.editorialSummary?.text),
          };
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(result));
        } catch (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    });

    apiReq.on("error", (err) => {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    });

    apiReq.write(payload);
    apiReq.end();
    return;
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
