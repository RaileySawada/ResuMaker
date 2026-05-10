export const generateId = (): string =>
  Math.random().toString(36).slice(2, 9) + Date.now().toString(36);

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const formatMonthYear = (date: string): string => {
  if (!date) return "";
  const [year, month] = date.split("-");
  const m = Number.parseInt(month, 10);
  return Number.isNaN(m) ? "" : `${MONTHS[m - 1]} ${year}`;
};

export const formatDateRange = (
  startDate: string,
  endDate: string,
  isCurrent: boolean,
): string => {
  const start = formatMonthYear(startDate);
  const end = isCurrent ? "Present" : formatMonthYear(endDate);
  if (!start && !end) return "";
  if (!start) return end;
  if (!end) return start;
  return `${start} - ${end}`;
};

export const formatCalendarDate = (date: string): string => {
  if (!date) return "";

  const [year, month, day] = date.split("-");
  const m = Number.parseInt(month, 10);
  const d = Number.parseInt(day, 10);

  if (!year || Number.isNaN(m) || Number.isNaN(d) || m < 1 || m > 12) {
    return date;
  }

  return `${MONTHS[m - 1]} ${d}, ${year}`;
};

export const parseBullets = (text: string): string[] =>
  text
    .split("\n")
    .map((s) => s.replace(/^(?:[-*]|\u2022)\s*/, "").trim())
    .filter(Boolean);

export const parseCommaList = (text: string): string[] =>
  text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
