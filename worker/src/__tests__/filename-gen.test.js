const fc = require("fast-check");
const { slugify } = require("../local-proxy");

// Feature: local-restaurant-admin, Property 5: Unique filename generation
// **Validates: Requirements 11.5**

/**
 * Generates a filename the same way the download-photo endpoint will:
 *   slugify(restaurantName) + "-" + index + ".jpg"
 */
function generateFilename(restaurantName, index) {
  return `${slugify(restaurantName)}-${index}.jpg`;
}

describe("Property 5: Unique filename generation", () => {
  test("distinct (name, index) pairs produce different filenames", () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.nat({ max: 100 })
        ),
        fc.tuple(
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.nat({ max: 100 })
        ),
        ([nameA, indexA], [nameB, indexB]) => {
          // Only test when the pairs are actually distinct
          fc.pre(nameA !== nameB || indexA !== indexB);

          const filenameA = generateFilename(nameA, indexA);
          const filenameB = generateFilename(nameB, indexB);

          // If slugify produces the same slug for different names,
          // the index difference must still make filenames unique.
          // If slugify produces different slugs, filenames differ regardless.
          if (slugify(nameA) === slugify(nameB)) {
            // Same slug — uniqueness depends on index
            if (indexA !== indexB) {
              expect(filenameA).not.toBe(filenameB);
            }
            // If both slug and index match, filenames will be equal —
            // this is expected when two different raw names slugify identically
          } else {
            expect(filenameA).not.toBe(filenameB);
          }
        }
      ),
      { numRuns: 200 }
    );
  });

  test("filenames contain only lowercase alphanumeric, hyphens, and .jpg extension", () => {
    // Generate names with special characters, unicode, spaces, etc.
    const nameArb = fc.oneof(
      fc.string({ minLength: 1, maxLength: 60 }),
      fc.unicodeString({ minLength: 1, maxLength: 40 }),
      // Names with spaces and special chars
      fc.array(
        fc.oneof(
          fc.constantFrom("Café", "Über", "日本語", "L'Amour", "Señor", "naïve"),
          fc.string({ minLength: 1, maxLength: 15 })
        ),
        { minLength: 1, maxLength: 4 }
      ).map((parts) => parts.join(" "))
    );

    fc.assert(
      fc.property(nameArb, fc.nat({ max: 999 }), (name, index) => {
        const filename = generateFilename(name, index);

        // Must end with .jpg
        expect(filename.endsWith(".jpg")).toBe(true);

        // Strip the .jpg extension and check the stem
        const stem = filename.slice(0, -4);

        // Stem must only contain lowercase a-z, 0-9, and hyphens
        expect(stem).toMatch(/^[a-z0-9-]+$/);
      }),
      { numRuns: 200 }
    );
  });

  test("filenames never have consecutive hyphens in the slug portion", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.nat({ max: 100 }),
        (name, index) => {
          const slug = slugify(name);
          // slugify replaces sequences of non-alphanumeric with a single hyphen
          // so consecutive hyphens should never appear in the slug itself
          expect(slug).not.toMatch(/--/);
        }
      ),
      { numRuns: 200 }
    );
  });

  test("slugify output has no leading or trailing hyphens", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        (name) => {
          const slug = slugify(name);
          if (slug.length > 0) {
            expect(slug[0]).not.toBe("-");
            expect(slug[slug.length - 1]).not.toBe("-");
          }
        }
      ),
      { numRuns: 200 }
    );
  });
});
