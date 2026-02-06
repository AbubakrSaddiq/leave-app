import { format, parseISO, isValid, addDays } from "date-fns";

/**
 * Formats a YYYY-MM-DD string into a human-readable format
 * Example: "2024-05-20" -> "Mon, May 20, 2024"
 */
export const formatDisplayDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "N/A";
  
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return "Invalid Date";
    
    return format(date, "EEE, MMM d, yyyy");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Error";
  }
};

/**
 * Helper to check if a date is a weekend (useful for client-side hints)
 */
export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

/**
 * Calculates the next working day after a given date
 */
export const calculateResumptionDate = (endDateString: string): string => {
  let date = parseISO(endDateString);
  let daysToAdd = 1;

  while (daysToAdd > 0) {
    date = addDays(date, 1);
    // 0 = Sunday, 6 = Saturday in some libs, but date-fns is easier
    const day = date.getDay();
    if (day !== 0 && day !== 6) {
      daysToAdd--;
    }
  }
  return format(date, "yyyy-MM-dd");
};