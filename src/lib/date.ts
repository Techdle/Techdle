export function getTodayDateString(): string {
  const now = new Date();
  now.setUTCHours(now.getUTCHours() + 8);
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateString(): string {
  const now = new Date();
  now.setUTCHours(now.getUTCHours() + 8);
  now.setUTCDate(now.getUTCDate() - 1);
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getPuzzleNumberByDate(dateStr: string): number {
  const epoch = new Date('2026-06-25T00:00:00Z').getTime();
  const targetDate = new Date(dateStr + 'T00:00:00Z').getTime();
  if (isNaN(targetDate) || targetDate < epoch) return 0;
  return Math.floor((targetDate - epoch) / 86400000) + 1;
}
