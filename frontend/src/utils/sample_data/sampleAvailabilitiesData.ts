import { v4 as uuidv4 } from "uuid";
import { Availability } from "@/models/availability";

const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "Europe/London",
  "Asia/Singapore",
  "Asia/Hong_Kong",
];

const BUSINESS_HOURS = {
  start: 9, // 9 AM
  end: 18, // 6 PM
};

const getRandomTimezone = () =>
  TIMEZONES[Math.floor(Math.random() * TIMEZONES.length)];

const getRandomFutureDate = (daysAhead: number = 7): Date => {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(now.getDate() + Math.floor(Math.random() * daysAhead));

  // Set to a random business hour
  const hour =
    Math.floor(Math.random() * (BUSINESS_HOURS.end - BUSINESS_HOURS.start)) +
    BUSINESS_HOURS.start;
  futureDate.setHours(hour, 0, 0, 0);

  return futureDate;
};

const createTimeSlot = (expertId: string, baseDate: Date): Availability => {
  const startDate = new Date(baseDate);
  const endDate = new Date(startDate);
  endDate.setHours(startDate.getHours() + 2); // 2-hour slots

  return {
    id: uuidv4(),
    expertId,
    startDate,
    endDate,
    isHighlighted: false,
    projectId: null,
  };
};

export const createSampleAvailabilities = (
  expertId: string
): Availability[] => {
  const numSlots = Math.floor(Math.random() * 3) + 3; // 3-5 slots per expert

  // Generate unique dates to avoid overlapping
  const dates = new Set<string>();
  while (dates.size < numSlots) {
    const date = getRandomFutureDate();
    dates.add(date.toISOString());
  }

  // Create availability slots
  return Array.from(dates).map((dateStr) =>
    createTimeSlot(expertId, new Date(dateStr))
  );
};
