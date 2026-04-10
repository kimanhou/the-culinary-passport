const VALID_CITIES = ['montreal', 'paris', 'tokyo', 'london'];

interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateForm(data: Record<string, any>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
    errors.name = 'Restaurant name is required';
  }

  if (!data.city || !VALID_CITIES.includes(data.city)) {
    errors.city = 'Please select a valid city';
  }

  if (
    !Array.isArray(data.coordinates) ||
    data.coordinates.length !== 2 ||
    typeof data.coordinates[0] !== 'number' ||
    typeof data.coordinates[1] !== 'number'
  ) {
    errors.coordinates = 'Coordinates (latitude and longitude) are required';
  }

  if (
    !Array.isArray(data.typeOfCuisine) ||
    data.typeOfCuisine.length === 0 ||
    !data.typeOfCuisine.every((c: any) => typeof c === 'string' && c.trim() !== '')
  ) {
    errors.typeOfCuisine = 'At least one cuisine type is required';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function checkDuplicate(name: string, existingNames: string[]): boolean {
  const lower = name.toLowerCase();
  return existingNames.some((n) => n.toLowerCase() === lower);
}
