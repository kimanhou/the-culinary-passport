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

// --- Admin utility functions ---

/**
 * Extracts structured place data from a Google Places API result object.
 * Used by the /admin/places-lookup endpoint.
 */
function extractPlaceData(place) {
  return {
    coordinates: place.location ? [place.location.latitude, place.location.longitude] : null,
    googleMapsUri: place.googleMapsUri || null,
    websiteUri: place.websiteUri || null,
    formattedAddress: place.formattedAddress || null,
    photos: (place.photos || []).map((p) => ({
      name: p.name,
      widthPx: p.widthPx,
      heightPx: p.heightPx,
    })),
  };
}

const CITY_FILE_MAP = {
  montreal: "data_montreal.json",
  paris: "data_paris.json",
  tokyo: "data_tokyo.json",
  london: "data_london.json",
};

function readCityData(city) {
  if (!Object.prototype.hasOwnProperty.call(CITY_FILE_MAP, city)) {
    return { error: `Invalid city. Must be one of: ${Object.keys(CITY_FILE_MAP).join(", ")}`, status: 400 };
  }
  const filename = CITY_FILE_MAP[city];
  const filePath = path.join("/app/public", filename);
  const raw = fs.readFileSync(filePath, "utf8");
  return { data: JSON.parse(raw) };
}

function writeCityData(city, data) {
  if (!Object.prototype.hasOwnProperty.call(CITY_FILE_MAP, city)) {
    return { error: `Invalid city. Must be one of: ${Object.keys(CITY_FILE_MAP).join(", ")}`, status: 400 };
  }
  const filename = CITY_FILE_MAP[city];
  const filePath = path.join("/app/public", filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 4), "utf8");
  return { success: true };
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

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
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  // GET /admin/restaurants — list restaurants for a city
  if (req.method === "GET" && parsedUrl.pathname === "/admin/restaurants") {
    const city = parsedUrl.searchParams.get("city");
    if (!city || !CITY_FILE_MAP[city]) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: `Invalid city. Must be one of: ${Object.keys(CITY_FILE_MAP).join(", ")}` }));
    }
    try {
      const result = readCityData(city);
      if (result.error) {
        res.writeHead(result.status, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: result.error }));
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(result.data));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: `Failed to read/write data file: ${err.message}` }));
    }
  }

  // POST /admin/restaurants — create a new restaurant entry
  if (req.method === "POST" && parsedUrl.pathname === "/admin/restaurants") {
    parseBody(req)
      .then((body) => {
        const { city, entry } = body;
        if (!city || !CITY_FILE_MAP[city]) {
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: `Invalid city. Must be one of: ${Object.keys(CITY_FILE_MAP).join(", ")}` }));
        }
        try {
          const result = readCityData(city);
          if (result.error) {
            res.writeHead(result.status, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: result.error }));
          }
          const data = result.data;
          const maxId = data.length > 0 ? Math.max(...data.map((e) => e.id)) : 0;
          const newId = maxId + 1;
          const newEntry = { ...entry, id: newId };
          data.push(newEntry);
          writeCityData(city, data);
          res.writeHead(200, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ success: true, id: newId }));
        } catch (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: `Failed to read/write data file: ${err.message}` }));
        }
      })
      .catch((err) => {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      });
    return;
  }

  // PUT /admin/restaurants/reorder — reorder restaurant entries
  if (req.method === "PUT" && parsedUrl.pathname === "/admin/restaurants/reorder") {
    parseBody(req)
      .then((body) => {
        const { city, orderedIds } = body;
        if (!city || !CITY_FILE_MAP[city]) {
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: `Invalid city. Must be one of: ${Object.keys(CITY_FILE_MAP).join(", ")}` }));
        }
        try {
          const result = readCityData(city);
          if (result.error) {
            res.writeHead(result.status, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: result.error }));
          }
          const data = result.data;
          const existingIds = data.map((e) => e.id).sort((a, b) => a - b);
          const sortedOrderedIds = [...orderedIds].sort((a, b) => a - b);
          if (
            !Array.isArray(orderedIds) ||
            orderedIds.length !== existingIds.length ||
            !sortedOrderedIds.every((id, i) => id === existingIds[i])
          ) {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Provided ids do not match existing entries" }));
          }
          const idToEntry = new Map(data.map((e) => [e.id, e]));
          const reordered = orderedIds.map((id) => idToEntry.get(id));
          writeCityData(city, reordered);
          res.writeHead(200, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ success: true }));
        } catch (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: `Failed to read/write data file: ${err.message}` }));
        }
      })
      .catch((err) => {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      });
    return;
  }

  // PUT /admin/restaurants — update an existing restaurant entry
  if (req.method === "PUT" && parsedUrl.pathname === "/admin/restaurants") {
    parseBody(req)
      .then((body) => {
        const { city, entry } = body;
        if (!city || !CITY_FILE_MAP[city]) {
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: `Invalid city. Must be one of: ${Object.keys(CITY_FILE_MAP).join(", ")}` }));
        }
        try {
          const result = readCityData(city);
          if (result.error) {
            res.writeHead(result.status, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: result.error }));
          }
          const data = result.data;
          const index = data.findIndex((e) => e.id === entry.id);
          if (index === -1) {
            res.writeHead(404, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: `Restaurant with id ${entry.id} not found in ${city}` }));
          }
          data[index] = { ...entry, id: data[index].id };
          writeCityData(city, data);
          res.writeHead(200, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ success: true }));
        } catch (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: `Failed to read/write data file: ${err.message}` }));
        }
      })
      .catch((err) => {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      });
    return;
  }

  // DELETE /admin/restaurants — delete a restaurant entry
  if (req.method === "DELETE" && parsedUrl.pathname === "/admin/restaurants") {
    const city = parsedUrl.searchParams.get("city");
    const idParam = parsedUrl.searchParams.get("id");
    if (!city || !CITY_FILE_MAP[city]) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: `Invalid city. Must be one of: ${Object.keys(CITY_FILE_MAP).join(", ")}` }));
    }
    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Missing or invalid id parameter" }));
    }
    try {
      const result = readCityData(city);
      if (result.error) {
        res.writeHead(result.status, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: result.error }));
      }
      const data = result.data;
      const index = data.findIndex((e) => e.id === id);
      if (index === -1) {
        res.writeHead(404, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: `Restaurant with id ${id} not found in ${city}` }));
      }
      data.splice(index, 1);
      writeCityData(city, data);
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ success: true }));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: `Failed to read/write data file: ${err.message}` }));
    }
  }

  // POST /admin/places-lookup — Google Places lookup for admin
  if (req.method === "POST" && parsedUrl.pathname === "/admin/places-lookup") {
    parseBody(req)
      .then((body) => {
        const { name, city } = body;
        if (!name) {
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Missing required field: name" }));
        }

        const payload = JSON.stringify({ textQuery: `${name} ${city || ""}`.trim() });
        const options = {
          hostname: "places.googleapis.com",
          path: "/v1/places:searchText",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
            "X-Goog-FieldMask": "places.location,places.googleMapsUri,places.websiteUri,places.formattedAddress,places.photos",
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
              if (!place) {
                res.writeHead(404, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ error: `No results found for '${name}' in ${city || "unknown"}` }));
              }
              const result = extractPlaceData(place);
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify(result));
            } catch (err) {
              res.writeHead(502, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: `Google Places API error: ${err.message}` }));
            }
          });
        });

        apiReq.on("error", (err) => {
          res.writeHead(502, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: `Google Places API error: ${err.message}` }));
        });

        apiReq.write(payload);
        apiReq.end();
      })
      .catch((err) => {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      });
    return;
  }

  // POST /admin/download-photo — download a Google Places photo and save locally
  if (req.method === "POST" && parsedUrl.pathname === "/admin/download-photo") {
    parseBody(req)
      .then((body) => {
        const { photoName, restaurantName, index } = body;
        if (!photoName || !restaurantName || index === undefined) {
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Missing required fields: photoName, restaurantName, index" }));
        }

        const filename = slugify(restaurantName) + "-" + index + ".jpg";
        const photosDir = path.join("/app/public", "photos");
        fs.mkdirSync(photosDir, { recursive: true });
        const filePath = path.join(photosDir, filename);

        const photoUrl = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=800&key=${GOOGLE_PLACES_API_KEY}`;
        const parsedPhotoUrl = new URL(photoUrl);

        const photoReq = https.get(
          {
            hostname: parsedPhotoUrl.hostname,
            path: parsedPhotoUrl.pathname + parsedPhotoUrl.search,
            headers: { Accept: "image/*" },
          },
          (photoRes) => {
            // Follow redirects (Google Places photo API returns 302)
            if (photoRes.statusCode >= 300 && photoRes.statusCode < 400 && photoRes.headers.location) {
              const redirectUrl = new URL(photoRes.headers.location);
              https.get(
                {
                  hostname: redirectUrl.hostname,
                  path: redirectUrl.pathname + redirectUrl.search,
                  headers: { Accept: "image/*" },
                },
                (redirectRes) => {
                  if (redirectRes.statusCode !== 200) {
                    res.writeHead(502, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ error: `Failed to download photo: HTTP ${redirectRes.statusCode}` }));
                  }
                  const fileStream = fs.createWriteStream(filePath);
                  redirectRes.pipe(fileStream);
                  fileStream.on("finish", () => {
                    fileStream.close();
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ path: "photos/" + filename }));
                  });
                  fileStream.on("error", (err) => {
                    res.writeHead(502, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: `Failed to download photo: ${err.message}` }));
                  });
                }
              ).on("error", (err) => {
                res.writeHead(502, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: `Failed to download photo: ${err.message}` }));
              });
              return;
            }

            if (photoRes.statusCode !== 200) {
              res.writeHead(502, { "Content-Type": "application/json" });
              return res.end(JSON.stringify({ error: `Failed to download photo: HTTP ${photoRes.statusCode}` }));
            }

            const fileStream = fs.createWriteStream(filePath);
            photoRes.pipe(fileStream);
            fileStream.on("finish", () => {
              fileStream.close();
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ path: "photos/" + filename }));
            });
            fileStream.on("error", (err) => {
              res.writeHead(502, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: `Failed to download photo: ${err.message}` }));
            });
          }
        );

        photoReq.on("error", (err) => {
          res.writeHead(502, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: `Failed to download photo: ${err.message}` }));
        });
      })
      .catch((err) => {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      });
    return;
  }

  // POST /admin/upload-photo — handle local image file upload (multipart/form-data)
  if (req.method === "POST" && parsedUrl.pathname === "/admin/upload-photo") {
    const contentType = req.headers["content-type"] || "";
    const boundaryMatch = contentType.match(/boundary=(.+)/);
    if (!boundaryMatch) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid file upload" }));
      return;
    }

    const boundary = boundaryMatch[1];
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      try {
        const body = Buffer.concat(chunks);
        const boundaryBuf = Buffer.from("--" + boundary);
        const parts = [];
        let start = 0;

        // Split body by boundary
        while (true) {
          const idx = body.indexOf(boundaryBuf, start);
          if (idx === -1) break;
          if (start > 0) {
            // Strip leading \r\n and trailing \r\n before boundary
            let partStart = start;
            let partEnd = idx - 2; // skip \r\n before boundary
            if (partEnd > partStart) {
              parts.push(body.slice(partStart, partEnd));
            }
          }
          start = idx + boundaryBuf.length;
          // Skip -- (end marker) or \r\n
          if (body[start] === 0x2d && body[start + 1] === 0x2d) break; // --
          start += 2; // skip \r\n
        }

        let restaurantName = null;
        let fileData = null;
        let originalFilename = null;

        for (const part of parts) {
          // Split headers from body at \r\n\r\n
          const headerEnd = part.indexOf("\r\n\r\n");
          if (headerEnd === -1) continue;
          const headers = part.slice(0, headerEnd).toString();
          const content = part.slice(headerEnd + 4);

          const nameMatch = headers.match(/name="([^"]+)"/);
          if (!nameMatch) continue;
          const fieldName = nameMatch[1];

          if (fieldName === "restaurantName") {
            restaurantName = content.toString().trim();
          } else if (fieldName === "file") {
            fileData = content;
            const filenameMatch = headers.match(/filename="([^"]+)"/);
            originalFilename = filenameMatch ? filenameMatch[1] : null;
          }
        }

        if (!restaurantName || !fileData || fileData.length === 0) {
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Invalid file upload" }));
        }

        // Extract extension from original filename, default to .jpg
        let ext = ".jpg";
        if (originalFilename) {
          const dotIdx = originalFilename.lastIndexOf(".");
          if (dotIdx !== -1) {
            ext = originalFilename.slice(dotIdx).toLowerCase();
          }
        }

        const filename = slugify(restaurantName) + "-upload-" + Date.now() + ext;
        const photosDir = path.join("/app/public", "photos");
        fs.mkdirSync(photosDir, { recursive: true });
        const filePath = path.join(photosDir, filename);

        fs.writeFileSync(filePath, fileData);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ path: "photos/" + filename }));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid file upload" }));
      }
    });
    req.on("error", () => {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid file upload" }));
    });
    return;
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

if (require.main === module) {
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Proxy listening on http://0.0.0.0:${PORT}`);
  });
}

module.exports = { CITY_FILE_MAP, readCityData, writeCityData, slugify, parseBody, extractPlaceData };
