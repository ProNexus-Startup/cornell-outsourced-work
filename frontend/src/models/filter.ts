import { v4 as uuidv4 } from "uuid";

export interface SortConfig {
  key: string | null;
  direction: "asc" | "desc" | null;
}

export interface Filter<T> {
  id: string;
  columnName: keyof T;
  filterValue?: string;
  filterType?:
    | "contains"
    | "startsWith"
    | "endsWith"
    | "equals"
    | "numeric"
    | "date"
    | null;
  isTableFilter: boolean;
  projectId: string;
  tableType: string;
  operator?: ">" | ">=" | "<" | "<=" | "=" | null;
  page?: string;
  isSortFilter?: boolean; // Indicates if this filter is for sorting
  sortDirection?: "asc" | "desc"; // Direction of sorting if this is a sort filter
}

export const filterFromJson = (json: any): Filter<any> => {
  return {
    id: json.id || uuidv4(),
    columnName: json.columnName,
    filterValue: json.filterValue,
    filterType: json.filterType,
    isTableFilter: json.isTableFilter || false,
    projectId: json.projectId,
    tableType: json.tableType,
    operator: json.operator,
    page: json.page,
    isSortFilter: json.isSortFilter || false,
    sortDirection: json.sortDirection,
  };
};

export const filterToJson = (filter: Filter<any>): Record<string, any> => {
  return {
    id: filter.id,
    columnName: filter.columnName,
    filterValue: filter.filterValue,
    filterType: filter.filterType,
    isTableFilter: filter.isTableFilter,
    projectId: filter.projectId,
    tableType: filter.tableType,
    operator: filter.operator,
    page: filter.page,
    isSortFilter: filter.isSortFilter || false,
    sortDirection: filter.sortDirection,
  };
};

// Create a sort filter
export const createSortFilter = <T>(
  columnName: keyof T,
  direction: "asc" | "desc",
  projectId: string,
  tableType: string,
  page?: string
): Filter<T> => {
  return {
    id: uuidv4(),
    columnName,
    isTableFilter: true,
    projectId,
    tableType,
    page,
    isSortFilter: true,
    sortDirection: direction,
  };
};

// Define the filter functions that can be referenced by filterType
export const filterFunctions = {
  contains: (value: any, searchTerm: string) => {
    if (!value) return false;
    return String(value).toLowerCase().includes(searchTerm.toLowerCase());
  },
  startsWith: (value: any, searchTerm: string) => {
    if (!value) return false;
    return String(value).toLowerCase().startsWith(searchTerm.toLowerCase());
  },
  endsWith: (value: any, searchTerm: string) => {
    if (!value) return false;
    return String(value).toLowerCase().endsWith(searchTerm.toLowerCase());
  },
  equals: (value: any, searchTerm: string) => {
    if (!value) return false;
    return String(value).toLowerCase() === searchTerm.toLowerCase();
  },
  numeric: (value: any, searchTerm: string) => {
    if (!value || !searchTerm) return false;
    const numValue = parseFloat(String(value));
    if (isNaN(numValue)) return false;

    const [operator, threshold] = searchTerm.split(":");
    const thresholdValue = parseFloat(threshold);
    if (isNaN(thresholdValue)) return false;

    switch (operator) {
      case "gt":
        return numValue > thresholdValue;
      case "gte":
        return numValue >= thresholdValue;
      case "lt":
        return numValue < thresholdValue;
      case "lte":
        return numValue <= thresholdValue;
      case "eq":
        return numValue === thresholdValue;
      default:
        return false;
    }
  },
  date: (value: any, searchTerm: string) => {
    if (!value || !searchTerm) return false;
    const dateValue = new Date(value);
    if (isNaN(dateValue.getTime())) return false;

    const [operator, threshold] = searchTerm.split(":");
    const thresholdDate = new Date(threshold);
    if (isNaN(thresholdDate.getTime())) return false;

    switch (operator) {
      case "gt":
        return dateValue > thresholdDate;
      case "gte":
        return dateValue >= thresholdDate;
      case "lt":
        return dateValue < thresholdDate;
      case "lte":
        return dateValue <= thresholdDate;
      case "eq":
        return dateValue.getTime() === thresholdDate.getTime();
      default:
        return false;
    }
  },
};
