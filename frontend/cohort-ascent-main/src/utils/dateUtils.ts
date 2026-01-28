import { addWeeks, startOfWeek, endOfWeek, format, isWithinInterval, parseISO } from 'date-fns';

export interface WeekRange {
  id: string;
  label: string;
  startDate: Date;
  endDate: Date;
  weekNumber: number;
}

/**
 * Generate calendar weeks dropdown based on start and end dates
 * Weeks start on Monday
 */
export const generateCalendarWeeks = (startDate: string, endDate: string): WeekRange[] => {
  const weeks: WeekRange[] = [];
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  
  // Get the Monday of the week containing the start date
  let currentWeekStart = startOfWeek(start, { weekStartsOn: 1 });
  let weekNumber = 1;
  
  while (currentWeekStart <= end) {
    const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
    
    weeks.push({
      id: `week-${weekNumber}`,
      label: `Week ${weekNumber}: ${format(currentWeekStart, 'MMM dd')} - ${format(weekEnd, 'MMM dd, yyyy')}`,
      startDate: currentWeekStart,
      endDate: weekEnd,
      weekNumber,
    });
    
    currentWeekStart = addWeeks(currentWeekStart, 1);
    weekNumber++;
  }
  
  return weeks;
};

/**
 * Get the current week from a list of weeks based on today's date
 */
export const getCurrentWeek = (weeks: WeekRange[]): WeekRange | undefined => {
  const today = new Date();
  return weeks.find(week => 
    isWithinInterval(today, { start: week.startDate, end: week.endDate })
  );
};

/**
 * Get month name from date
 */
export const getMonthName = (date: string): string => {
  return format(parseISO(date), 'MMMM yyyy');
};

/**
 * Group efforts by week
 */
export const groupEffortsByWeek = <T extends { date: string }>(
  efforts: T[],
  weeks: WeekRange[]
): Record<string, T[]> => {
  const grouped: Record<string, T[]> = {};
  
  efforts.forEach(effort => {
    const effortDate = parseISO(effort.date);
    const week = weeks.find(w => 
      isWithinInterval(effortDate, { start: w.startDate, end: w.endDate })
    );
    
    if (week) {
      if (!grouped[week.id]) grouped[week.id] = [];
      grouped[week.id].push(effort);
    }
  });
  
  return grouped;
};