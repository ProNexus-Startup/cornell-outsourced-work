import { v4 as uuidv4 } from "uuid";

export type FilterCategory =
  | "company"
  | "role"
  | "seniority"
  | "location"
  | "industry";
export type FilterLogic = "must_have" | "cant_have" | "may_have";
export type FilterTiming =
  | "current"
  | "1_2_years"
  | "2_3_years"
  | "3_4_years"
  | "4_plus_years";

export interface MetaExpertFilter {
  id: string;
  category: FilterCategory;
  value: string;
  logic: FilterLogic;
  timing?: FilterTiming;
}

export const createMetaExpertFilter = (
  category: FilterCategory,
  value: string,
  logic: FilterLogic = "may_have",
  timing?: FilterTiming
): MetaExpertFilter => {
  return {
    id: uuidv4(),
    category,
    value,
    logic,
    timing,
  };
};

export const metaExpertFilterFromJson = (json: any): MetaExpertFilter => {
  return {
    id: json.id || uuidv4(),
    category: json.category,
    value: json.value,
    logic: json.logic || "may_have",
    timing: json.timing,
  };
};

export const metaExpertFilterToJson = (
  filter: MetaExpertFilter
): Record<string, any> => {
  return {
    id: filter.id,
    category: filter.category,
    value: filter.value,
    logic: filter.logic,
    timing: filter.timing,
  };
};
