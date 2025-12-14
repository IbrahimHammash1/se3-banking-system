export function generateExpireDateUtil(hours: number): Date {
  const date = new Date();
  const hoursToAdd = hours * 60 * 60 * 1000; // Convert hours to milliseconds
  date.setTime(date.getTime() + hoursToAdd);
  return date;
}
