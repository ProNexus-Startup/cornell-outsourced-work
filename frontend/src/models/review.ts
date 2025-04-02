export interface Review {
  id?: string | null;
  metaExpertId?: string | null; // Added for meta expert relationship
  rating?: number | null;
  comment?: string | null;
  date?: Date | null;
}

// Utility function to parse a date string (equivalent to tryParseDateTime in Dart)
const tryParseDate = (date: any): Date | null => {
  if (!date) return null;

  // If it's already a Date object, return it
  if (date instanceof Date) return date;

  try {
    // For ISO date strings from form inputs (YYYY-MM-DD)
    if (typeof date === "string" && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = date.split("-").map(Number);
      // Create date in UTC
      const utcDate = new Date(Date.UTC(year, month - 1, day));
      // Adjust for timezone offset
      const offset = utcDate.getTimezoneOffset();
      return new Date(utcDate.getTime() + offset * 60 * 1000);
    }

    // For full ISO strings or other date formats
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return null;

    // Adjust for timezone offset
    const offset = parsedDate.getTimezoneOffset();
    return new Date(parsedDate.getTime() + offset * 60 * 1000);
  } catch {
    return null;
  }
};

// Utility function to create a Job object from JSON
export const reviewFromJson = (json: any): Review => {
  return {
    id: json.id || null,
    metaExpertId: json.metaExpertId || null,
    rating: json.rating || null,
    comment: json.comment || null,
    date: tryParseDate(json.date),
  };
};
