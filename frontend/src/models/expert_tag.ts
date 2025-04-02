import { TagCategory } from "./tag";

interface ExpertTag {
  id: string;
  category: string;
  value: string;
  startDate: Date | null;
  endDate: Date | null;
  yearlyFrequency: number | null;
  dateRecorded: Date | null;
  metaExpertId: string;
  organizationId: string;
}

export const expertTagFromJson = (json: any): ExpertTag => {
  return {
    id: json.id || "",
    category: json.category || "",
    value: json.value || json.tag || "",
    startDate: json.startDate ? new Date(json.startDate) : null,
    endDate: json.endDate ? new Date(json.endDate) : null,
    yearlyFrequency: json.yearlyFrequency || null,
    dateRecorded: json.dateRecorded ? new Date(json.dateRecorded) : null,
    metaExpertId: json.metaExpertId || "",
    organizationId: json.organizationId || "",
  };
};

export default ExpertTag;
