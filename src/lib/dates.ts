const DAY_MS = 24 * 60 * 60 * 1000;

export function todayISO(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(iso: string, days: number): string {
  const date = parseISO(iso);
  date.setDate(date.getDate() + days);
  return todayISO(date);
}

export function addWeeks(iso: string, weeks: number): string {
  return addDays(iso, weeks * 7);
}

export function addMonths(iso: string, months: number): string {
  const date = parseISO(iso);
  date.setMonth(date.getMonth() + months);
  return todayISO(date);
}

export function daysBetween(fromISO: string, toISO: string): number {
  const from = parseISO(fromISO).getTime();
  const to = parseISO(toISO).getTime();
  return Math.round((to - from) / DAY_MS);
}

export function formatDisplayDate(iso: string): string {
  return parseISO(iso).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(iso: string): string {
  return parseISO(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function startOfMonth(iso: string): Date {
  const date = parseISO(iso);
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function monthLabel(year: number, monthIndex: number): string {
  return new Date(year, monthIndex, 1).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
}

export function getCalendarCells(year: number, monthIndex: number) {
  const first = new Date(year, monthIndex, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells: Array<{ iso: string | null; day: number | null }> = [];

  for (let i = 0; i < startPad; i += 1) {
    cells.push({ iso: null, day: null });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const iso = todayISO(new Date(year, monthIndex, day));
    cells.push({ iso, day });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ iso: null, day: null });
  }

  return cells;
}
