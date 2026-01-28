export interface WeekOption {
  label: string;
  value: string;
  startDate: Date;
  endDate: Date;
}

export const generateCalendarWeeks = (startDate: Date, endDate: Date): WeekOption[] => {
  const weeks: WeekOption[] = [];
  const currentDate = new Date(startDate);

  // Find the first Monday on or before startDate
  const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  currentDate.setDate(currentDate.getDate() - daysToSubtract);

  let weekNumber = 1;

  while (currentDate <= endDate) {
    const weekStart = new Date(currentDate);
    const weekEnd = new Date(currentDate);
    weekEnd.setDate(weekEnd.getDate() + 6);

    if (weekStart <= endDate) {
      const startFormatted = weekStart.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).replace(/ /g, '-');

      const endFormatted = weekEnd.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).replace(/ /g, '-');

      const label = `Week ${weekNumber}: ${startFormatted} to ${endFormatted}`;
      const value = weekStart.toISOString().split('T')[0];

      weeks.push({
        label,
        value,
        startDate: new Date(weekStart),
        endDate: new Date(weekEnd)
      });

      weekNumber++;
    }

    // Move to next Monday
    currentDate.setDate(currentDate.getDate() + 7);
  }

  return weeks;
};