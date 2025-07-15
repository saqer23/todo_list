/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
type FilterObject = {
  [key: string]: any; // Generalizing to handle any kind of nested objects
};

function convertStringNumbers(filters: FilterObject): FilterObject {
  const result: FilterObject = {};

  // Helper function to check if a string is in ISO 8601 date format
  function isIsoDateString(value: any): boolean {
    // Regex pattern for ISO 8601 date strings
    const isoDatePattern =
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/;
    return isoDatePattern.test(value);
  }

  function processValue(value: any): any {
    if (typeof value === 'string') {
      if (isIsoDateString(value)) {
        return value; // Keep as a string, don't change it to number
      } else if (/[a-zA-Z]/.test(value)) {
        return value; // Return as is if it contains English letters
      } else if (!isNaN(parseFloat(value))) {
        return value.includes('.') ? parseFloat(value) : parseInt(value, 10);
      } else if (value === 'true') {
        return true;
      } else if (value === 'false') {
        return false;
      }
      return value;
    } else if (typeof value === 'object' && value !== null) {
      return convertStringNumbers(value);
    } else {
      return value;
    }
  }

  for (const [key, conditions] of Object.entries(filters)) {
    if (typeof conditions === 'object' && conditions !== null) {
      result[key] = {};
      for (const [op, value] of Object.entries(conditions)) {
        if (['gte', 'lte'].includes(op) && isIsoDateString(value)) {
          // Special handling for date-related operations
          result[key][op] = new Date(value as string);
        } else {
          result[key][op] = processValue(value);
        }
      }
    } else {
      result[key] = processValue(conditions);
    }
  }

  return result;
}

// Export the function itself, not its result
export default convertStringNumbers;
