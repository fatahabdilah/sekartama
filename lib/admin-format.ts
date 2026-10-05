const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2025/02/06" — the list-table date column. */
export const listDate = (iso: string) => iso.slice(0, 10).replaceAll("-", "/");

/** "February 6, 2025 at 5:08 am" (site timezone: Asia/Jakarta). */
export function longDateTime(iso: string) {
  const d = new Date(new Date(iso).getTime() + 7 * 3600_000);
  const hours = d.getUTCHours();
  const minutes = String(d.getUTCMinutes()).padStart(2, "0");
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()} at ${hours % 12 || 12}:${minutes} ${hours < 12 ? "am" : "pm"}`;
}

/** "Feb 6th" — the dashboard Activity widget. */
export function activityDate(iso: string) {
  const [, m, day] = iso.slice(0, 10).split("-").map(Number);
  const suffix = day % 10 === 1 && day !== 11 ? "st" : day % 10 === 2 && day !== 12 ? "nd" : day % 10 === 3 && day !== 13 ? "rd" : "th";
  return `${SHORT[m - 1]} ${day}${suffix}`;
}

export const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;
