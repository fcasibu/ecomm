import { format, isSameDay, isSameMonth, isSameYear } from 'date-fns';

export function formatDateRange(start: Date, end: Date): string {
  if (isSameDay(start, end)) {
    return format(start, 'MMM d');
  }

  if (isSameMonth(start, end) && isSameYear(start, end)) {
    return `${format(start, 'MMM d')}-${format(end, 'd')}`;
  }

  if (isSameYear(start, end)) {
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d')}`;
  }

  return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`;
}
