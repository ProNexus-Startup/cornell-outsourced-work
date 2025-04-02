export interface Job {
  id?: string | null;
  expertId?: string | null;
  projectId?: string | null;
  role?: string | null;
  description?: string | null;
  company?: string | null;
  startDate: Date | null; // Changed from optional to required, but can be null
  endDate: Date | null; // Changed from optional to required, but can be null
  organizationId?: string | null;
  sourceEmailId?: string | null;
  industry?: string | null;
  subIndustry?: string | null;
  location?: string | null;
  seniorityLevel?: string | null;
  isEducation?: boolean;
  isHighlighted?: boolean;
  metaExpertId?: string | null; // Added for meta expert relationship
  type?: "experience" | "education"; // Add type field to distinguish between experience and education
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
export const jobFromJson = (json: any): Job => {
  return {
    id: json.id || null,
    expertId: json.expertId || null,
    projectId: json.projectId || null,
    role: json.role || null,
    company: json.company || null,
    description: json.description || null,
    startDate: tryParseDate(json.startDate),
    endDate: tryParseDate(json.endDate),
    organizationId: json.organizationId || json.organizationID || null,
    sourceEmailId: json.sourceEmailId || null,
    industry: json.industry || null,
    subIndustry: json.subIndustry || null,
    location: json.location || null,
    seniorityLevel: json.seniorityLevel || null,
    isEducation: json.isEducation || false,
    isHighlighted: json.isHighlighted || false,
    metaExpertId: json.metaExpertId || null,
    type: json.type || "experience",
  };
};

// Utility function to convert a Job object to JSON
export const jobToJson = (job: Job): Record<string, any> => {
  return {
    id: job.id,
    expertId: job.expertId,
    role: job.role,
    company: job.company,
    description: job.description,
    startDate: job.startDate?.toISOString().split("T")[0] || null,
    endDate: job.endDate?.toISOString().split("T")[0] || null,
    organizationId: job.organizationId,
    sourceEmailId: job.sourceEmailId,
    industry: job.industry,
    subIndustry: job.subIndustry,
    location: job.location,
    seniorityLevel: job.seniorityLevel,
    isEducation: job.isEducation,
    isHighlighted: job.isHighlighted || false,
    metaExpertId: job.metaExpertId,
    type: job.type,
  };
};
