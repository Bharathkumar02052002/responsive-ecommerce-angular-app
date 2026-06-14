export function getDeliveryWindow(startDays = 3, endDays = 5): string {
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  });
  const startDate = addDays(new Date(), startDays);
  const endDate = addDays(new Date(), endDays);

  return `${formatter.format(startDate)} - ${formatter.format(endDate)}`;
}

function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}
