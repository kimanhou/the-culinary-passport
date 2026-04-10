import * as fc from 'fast-check';
import { validateForm, checkDuplicate } from '../adminValidation';

// Feature: local-restaurant-admin, Property 2: Form validation rejects incomplete data
// **Validates: Requirements 3.2, 7.3, 12.1, 12.2, 12.3, 12.4**

const VALID_CITIES = ['montreal', 'paris', 'tokyo', 'london'] as const;

/** Generator for a non-empty trimmed string (valid name) */
const validNameArb = fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0);

/** Generator for a valid city */
const validCityArb = fc.constantFrom(...VALID_CITIES);

/** Generator for valid coordinates [lat, lng] */
const validCoordinatesArb = fc.tuple(
  fc.double({ min: -90, max: 90, noNaN: true }),
  fc.double({ min: -180, max: 180, noNaN: true })
);

/** Generator for a valid typeOfCuisine (non-empty array of non-empty strings) */
const validCuisineArb = fc.array(
  fc.string({ minLength: 1, maxLength: 30 }).filter((s) => s.trim().length > 0),
  { minLength: 1, maxLength: 5 }
);

/** Generator for a fully valid form data object */
const validFormDataArb = fc.record({
  name: validNameArb,
  city: validCityArb,
  coordinates: validCoordinatesArb,
  typeOfCuisine: validCuisineArb,
  // Optional fields
  description: fc.string({ maxLength: 100 }),
  images: fc.array(fc.string({ minLength: 1, maxLength: 50 }), { maxLength: 3 }),
  googleMaps: fc.string({ maxLength: 80 }),
  instagram: fc.string({ maxLength: 80 }),
  website: fc.string({ maxLength: 80 }),
  tags: fc.array(fc.string({ maxLength: 20 }), { maxLength: 5 }),
  price: fc.constantFrom('$', '$$', '$$$'),
});

describe('Property 2: Form validation rejects incomplete data', () => {
  test('valid data with all required fields is accepted', () => {
    fc.assert(
      fc.property(validFormDataArb, (data) => {
        const result = validateForm(data);
        expect(result.valid).toBe(true);
        expect(Object.keys(result.errors)).toHaveLength(0);
      }),
      { numRuns: 100 }
    );
  });

  test('missing name is rejected with name error', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(undefined, null, '', '   ', '\t\n'),
        validCityArb,
        validCoordinatesArb,
        validCuisineArb,
        (name, city, coordinates, typeOfCuisine) => {
          const result = validateForm({ name, city, coordinates, typeOfCuisine });
          expect(result.valid).toBe(false);
          expect(result.errors).toHaveProperty('name');
        }
      ),
      { numRuns: 100 }
    );
  });

  test('missing or invalid city is rejected with city error', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter((s) => !(VALID_CITIES as readonly string[]).includes(s)),
        validNameArb,
        validCoordinatesArb,
        validCuisineArb,
        (city, name, coordinates, typeOfCuisine) => {
          const result = validateForm({ name, city, coordinates, typeOfCuisine });
          expect(result.valid).toBe(false);
          expect(result.errors).toHaveProperty('city');
        }
      ),
      { numRuns: 100 }
    );
  });

  test('missing coordinates is rejected with coordinates error', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(undefined, null, [], [1], 'not-an-array', [1, 'two']),
        validNameArb,
        validCityArb,
        validCuisineArb,
        (coordinates, name, city, typeOfCuisine) => {
          const result = validateForm({ name, city, coordinates, typeOfCuisine });
          expect(result.valid).toBe(false);
          expect(result.errors).toHaveProperty('coordinates');
        }
      ),
      { numRuns: 100 }
    );
  });

  test('empty typeOfCuisine is rejected with typeOfCuisine error', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(undefined, null, [], [''], ['  ']),
        validNameArb,
        validCityArb,
        validCoordinatesArb,
        (typeOfCuisine, name, city, coordinates) => {
          const result = validateForm({ name, city, coordinates, typeOfCuisine });
          expect(result.valid).toBe(false);
          expect(result.errors).toHaveProperty('typeOfCuisine');
        }
      ),
      { numRuns: 100 }
    );
  });

  test('valid data with optional fields empty is still accepted', () => {
    fc.assert(
      fc.property(
        validNameArb,
        validCityArb,
        validCoordinatesArb,
        validCuisineArb,
        (name, city, coordinates, typeOfCuisine) => {
          // Only required fields, no optional fields at all
          const result = validateForm({ name, city, coordinates, typeOfCuisine });
          expect(result.valid).toBe(true);
          expect(Object.keys(result.errors)).toHaveLength(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('random combinations of missing required fields are rejected for each missing field', () => {
    // Generate a bitmask to decide which required fields to omit (at least one must be omitted)
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 15 }), // 4-bit mask, at least 1 bit set
        validNameArb,
        validCityArb,
        validCoordinatesArb,
        validCuisineArb,
        (mask, name, city, coordinates, typeOfCuisine) => {
          const data: Record<string, any> = {};

          const omitName = (mask & 1) !== 0;
          const omitCity = (mask & 2) !== 0;
          const omitCoordinates = (mask & 4) !== 0;
          const omitCuisine = (mask & 8) !== 0;

          if (!omitName) data.name = name;
          if (!omitCity) data.city = city;
          if (!omitCoordinates) data.coordinates = coordinates;
          if (!omitCuisine) data.typeOfCuisine = typeOfCuisine;

          const result = validateForm(data);
          expect(result.valid).toBe(false);

          if (omitName) expect(result.errors).toHaveProperty('name');
          if (omitCity) expect(result.errors).toHaveProperty('city');
          if (omitCoordinates) expect(result.errors).toHaveProperty('coordinates');
          if (omitCuisine) expect(result.errors).toHaveProperty('typeOfCuisine');
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: local-restaurant-admin, Property 12: Case-insensitive duplicate detection
// **Validates: Requirements 16.1**

/** Generator for a non-empty name string */
const nameArb = fc.string({ minLength: 1, maxLength: 40 }).filter((s) => s.trim().length > 0);

/** Generator for a random casing transformation of a string */
const randomCasing = (s: string): fc.Arbitrary<string> =>
  fc
    .array(fc.boolean(), { minLength: s.length, maxLength: s.length })
    .map((flags) => s.split('').map((ch, i) => (flags[i] ? ch.toUpperCase() : ch.toLowerCase())).join(''));

describe('Property 12: Case-insensitive duplicate detection', () => {
  test('same name with different casing is detected as duplicate', () => {
    fc.assert(
      fc.property(nameArb, (name) =>
        fc.assert(
          fc.property(randomCasing(name), randomCasing(name), (variant1, variant2) => {
            expect(checkDuplicate(variant1, [variant2])).toBe(true);
          }),
          { numRuns: 5 }
        )
      ),
      { numRuns: 100 }
    );
  });

  test('different names are not detected as duplicates', () => {
    fc.assert(
      fc.property(
        nameArb,
        nameArb.filter((s) => s.length > 0),
        (name1, name2) => {
          fc.pre(name1.toLowerCase() !== name2.toLowerCase());
          expect(checkDuplicate(name1, [name2])).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('symmetry: checkDuplicate(a, [b]) === checkDuplicate(b, [a])', () => {
    fc.assert(
      fc.property(nameArb, nameArb, (a, b) => {
        expect(checkDuplicate(a, [b])).toBe(checkDuplicate(b, [a]));
      }),
      { numRuns: 100 }
    );
  });

  test('empty existing list never detects a duplicate', () => {
    fc.assert(
      fc.property(nameArb, (name) => {
        expect(checkDuplicate(name, [])).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  test('exact match in list is detected as duplicate', () => {
    fc.assert(
      fc.property(
        nameArb,
        fc.array(nameArb, { minLength: 0, maxLength: 5 }),
        (name, others) => {
          // Insert the exact name somewhere in the list
          const list = [...others, name];
          expect(checkDuplicate(name, list)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
