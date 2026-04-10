const fc = require("fast-check");
const fs = require("fs");
const { CITY_FILE_MAP, readCityData, writeCityData } = require("../local-proxy");

// Feature: local-restaurant-admin, Property 1: City-to-file mapping
// **Validates: Requirements 2.2**

const VALID_CITIES = Object.keys(CITY_FILE_MAP);

// Note: local-proxy.js starts an HTTP server on import as a side effect.
// Jest --forceExit in package.json handles cleanup of the open server handle.

describe("Property 1: City-to-file mapping", () => {
  test("valid cities map to data_{city}.json", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...VALID_CITIES),
        (city) => {
          const expected = `data_${city}.json`;
          expect(CITY_FILE_MAP[city]).toBe(expected);
        }
      ),
      { numRuns: 100 }
    );
  });

  test("invalid cities are not in CITY_FILE_MAP and readCityData returns error", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter(
          (s) => !VALID_CITIES.includes(s)
        ),
        (randomString) => {
          // The map should not contain arbitrary strings as own properties
          expect(Object.prototype.hasOwnProperty.call(CITY_FILE_MAP, randomString)).toBe(false);

          // readCityData should return an error object for invalid cities
          const result = readCityData(randomString);
          expect(result).toHaveProperty("error");
          expect(result).toHaveProperty("status", 400);
          expect(result.error).toContain("Invalid city");
        }
      ),
      { numRuns: 100 }
    );
  });

  test("CITY_FILE_MAP contains exactly the four expected cities", () => {
    const expectedCities = ["montreal", "paris", "tokyo", "london"];
    expect(Object.keys(CITY_FILE_MAP).sort()).toEqual(expectedCities.sort());
  });
});

// --- Generators for CRUD property tests ---

/** Generate a valid restaurant entry without id */
const entryWithoutIdArb = fc.record({
  name: fc.string({ minLength: 1, maxLength: 50 }),
  tags: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 0, maxLength: 5 }),
  description: fc.string({ maxLength: 100 }),
  price: fc.constantFrom("$", "$$", "$$$"),
  typeOfCuisine: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 3 }),
  neighborhood: fc.string({ maxLength: 30 }),
  images: fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 0, maxLength: 3 }),
});

/** Generate an array of entries with unique sequential ids */
const entryArrayArb = (minLen = 0, maxLen = 10) =>
  fc.array(entryWithoutIdArb, { minLength: minLen, maxLength: maxLen }).map((entries) =>
    entries.map((e, i) => ({ ...e, id: i + 1 }))
  );

/** Generate an array with non-sequential (but unique) positive ids */
const entryArrayWithGapsArb = fc
  .array(
    fc.record({
      entry: entryWithoutIdArb,
      id: fc.integer({ min: 1, max: 1000 }),
    }),
    { minLength: 0, maxLength: 10 }
  )
  .map((items) => {
    // Ensure unique ids
    const seen = new Set();
    return items
      .filter((item) => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      })
      .map((item) => ({ ...item.entry, id: item.id }));
  });

// Feature: local-restaurant-admin, Property 6: Create restaurant round-trip
// **Validates: Requirements 10.2**

describe("Property 6: Create restaurant round-trip", () => {
  let writtenData;

  beforeEach(() => {
    writtenData = null;
    jest.spyOn(fs, "writeFileSync").mockImplementation((_path, content) => {
      writtenData = content;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("creating an entry then reading back yields the same fields plus an id", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...VALID_CITIES),
        entryArrayArb(0, 8),
        entryWithoutIdArb,
        (city, existingData, newEntry) => {
          // Mock read to return existing data
          jest.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify(existingData));

          // Simulate create: read, assign id, push, write
          const readResult = readCityData(city);
          const data = readResult.data;
          const maxId = data.length > 0 ? Math.max(...data.map((e) => e.id)) : 0;
          const newId = maxId + 1;
          const created = { ...newEntry, id: newId };
          data.push(created);
          writeCityData(city, data);

          // Read back what was written
          const written = JSON.parse(writtenData);
          const found = written.find((e) => e.id === newId);

          expect(found).toBeDefined();
          // Verify all original fields are preserved
          for (const key of Object.keys(newEntry)) {
            expect(found[key]).toEqual(newEntry[key]);
          }
          expect(found.id).toBe(newId);
        }
      ),
      { numRuns: 100 }
    );
  });
});


// Feature: local-restaurant-admin, Property 7: ID assignment is max plus one
// **Validates: Requirements 10.3**

describe("Property 7: ID assignment is max plus one", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("new id equals max(existing ids) + 1, or 1 for empty array", () => {
    fc.assert(
      fc.property(
        entryArrayWithGapsArb,
        (existingData) => {
          jest.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify(existingData));
          jest.spyOn(fs, "writeFileSync").mockImplementation(() => {});

          const readResult = readCityData("montreal");
          const data = readResult.data;
          const maxId = data.length > 0 ? Math.max(...data.map((e) => e.id)) : 0;
          const newId = maxId + 1;

          if (existingData.length === 0) {
            expect(newId).toBe(1);
          } else {
            const expectedMax = Math.max(...existingData.map((e) => e.id));
            expect(newId).toBe(expectedMax + 1);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: local-restaurant-admin, Property 8: JSON file formatting consistency
// **Validates: Requirements 10.4, 14.5, 15.4, 17.4**

describe("Property 8: JSON file formatting consistency", () => {
  let writtenContent;

  beforeEach(() => {
    writtenContent = null;
    jest.spyOn(fs, "writeFileSync").mockImplementation((_path, content) => {
      writtenContent = content;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("writeCityData produces valid JSON with 4-space indentation", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...VALID_CITIES),
        entryArrayArb(0, 10),
        (city, data) => {
          writeCityData(city, data);

          // Must be valid JSON
          const parsed = JSON.parse(writtenContent);
          expect(parsed).toEqual(data);

          // Must match 4-space indentation format
          const expected = JSON.stringify(data, null, 4);
          expect(writtenContent).toBe(expected);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: local-restaurant-admin, Property 9: Update preserves id and modifies entry
// **Validates: Requirements 14.4**

describe("Property 9: Update preserves id and modifies entry", () => {
  let writtenData;

  beforeEach(() => {
    writtenData = null;
    jest.spyOn(fs, "writeFileSync").mockImplementation((_path, content) => {
      writtenData = content;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("updating an entry preserves its id and does not change array length", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...VALID_CITIES),
        entryArrayArb(1, 10),
        entryWithoutIdArb,
        (city, existingData, updatedFields) => {
          // Pick a random entry to update
          const targetIndex = Math.floor(Math.random() * existingData.length);
          const targetId = existingData[targetIndex].id;
          const originalCount = existingData.length;

          jest.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify(existingData));

          // Simulate update logic from the PUT handler
          const readResult = readCityData(city);
          const data = readResult.data;
          const index = data.findIndex((e) => e.id === targetId);
          const updatedEntry = { ...updatedFields, id: targetId };
          data[index] = { ...updatedEntry, id: data[index].id };
          writeCityData(city, data);

          const written = JSON.parse(writtenData);

          // Count unchanged
          expect(written.length).toBe(originalCount);

          // Id preserved
          const found = written.find((e) => e.id === targetId);
          expect(found).toBeDefined();
          expect(found.id).toBe(targetId);

          // Updated fields applied
          for (const key of Object.keys(updatedFields)) {
            expect(found[key]).toEqual(updatedFields[key]);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: local-restaurant-admin, Property 10: Delete removes exactly one entry
// **Validates: Requirements 15.3**

describe("Property 10: Delete removes exactly one entry", () => {
  let writtenData;

  beforeEach(() => {
    writtenData = null;
    jest.spyOn(fs, "writeFileSync").mockImplementation((_path, content) => {
      writtenData = content;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("deleting an id removes exactly one entry and preserves all others", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...VALID_CITIES),
        entryArrayArb(1, 10),
        (city, existingData) => {
          // Pick a random entry to delete
          const targetIndex = Math.floor(Math.random() * existingData.length);
          const targetId = existingData[targetIndex].id;
          const originalCount = existingData.length;

          jest.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify(existingData));

          // Simulate delete logic from the DELETE handler
          const readResult = readCityData(city);
          const data = readResult.data;
          const index = data.findIndex((e) => e.id === targetId);
          data.splice(index, 1);
          writeCityData(city, data);

          const written = JSON.parse(writtenData);

          // Exactly one fewer entry
          expect(written.length).toBe(originalCount - 1);

          // Deleted entry is gone
          expect(written.find((e) => e.id === targetId)).toBeUndefined();

          // All other entries preserved
          const remainingOriginals = existingData.filter((e) => e.id !== targetId);
          for (const orig of remainingOriginals) {
            const found = written.find((e) => e.id === orig.id);
            expect(found).toBeDefined();
            expect(found).toEqual(orig);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: local-restaurant-admin, Property 11: Reorder preserves entries and applies order
// **Validates: Requirements 17.3**

describe("Property 11: Reorder preserves entries and applies order", () => {
  let writtenData;

  beforeEach(() => {
    writtenData = null;
    jest.spyOn(fs, "writeFileSync").mockImplementation((_path, content) => {
      writtenData = content;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("reordering with a permutation preserves all entries and applies the new order", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...VALID_CITIES),
        entryArrayArb(1, 10).chain((data) => {
          // Generate a random permutation of the ids
          const ids = data.map((e) => e.id);
          return fc.shuffledSubarray(ids, { minLength: ids.length, maxLength: ids.length })
            .map((permutedIds) => ({ data, permutedIds }));
        }),
        (city, { data: existingData, permutedIds }) => {
          jest.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify(existingData));

          // Simulate reorder logic from the PUT /reorder handler
          const readResult = readCityData(city);
          const data = readResult.data;
          const idToEntry = new Map(data.map((e) => [e.id, e]));
          const reordered = permutedIds.map((id) => idToEntry.get(id));
          writeCityData(city, reordered);

          const written = JSON.parse(writtenData);

          // (a) Entries appear in the order specified by permutedIds
          expect(written.map((e) => e.id)).toEqual(permutedIds);

          // (b) No entries added or removed
          expect(written.length).toBe(existingData.length);

          // (c) Each entry's data is unchanged
          const originalMap = new Map(existingData.map((e) => [e.id, e]));
          for (const entry of written) {
            expect(entry).toEqual(originalMap.get(entry.id));
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
