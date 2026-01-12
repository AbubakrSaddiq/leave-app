// ============================================
// Date Utility Functions
// ============================================

import { format, parseISO, differenceInDays, addDays, isWeekend } from 'date-fns';

// ============================================
// FORMATTING
// ============================================

export const formatDate = (
  date: string | Date,
  formatString: string = 'MMM dd, yyyy'
): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatString);
  } catch {
    return 'Invalid Date';
  }
};

export const formatDateToISO = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const formatDateRange = (startDate: string, endDate: string): string => {
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

export const formatRelativeDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const now = new Date();
  const days = differenceInDays(dateObj, now);

  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days === -1) return 'Yesterday';
  if (days > 0) return `In ${days} days`;
  return `${Math.abs(days)} days ago`;
};

// ============================================
// CALCULATIONS
// ============================================

export const daysBetween = (
  startDate: string | Date,
  endDate: string | Date
): number => {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  return differenceInDays(end, start) + 1;
};

export const calculateWorkingDays = (
  startDate: string | Date,
  endDate: string | Date
): number => {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;

  let workingDays = 0;
  let currentDate = start;

  while (currentDate <= end) {
    if (!isWeekend(currentDate)) {
      workingDays++;
    }
    currentDate = addDays(currentDate, 1);
  }

  return workingDays;
};

export const getMinimumLeaveDate = (noticeDays: number): string => {
  const minDate = addDays(new Date(), noticeDays);
  return formatDateToISO(minDate);
};

export const isDateInPast = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dateObj < today;
};

export const isValidDateRange = (
  startDate: string | Date,
  endDate: string | Date
): boolean => {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  return end >= start;
};

export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};