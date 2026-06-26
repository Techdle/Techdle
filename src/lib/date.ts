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
