import type { DashboardFilters } from "@/features/statistiques/types/dashboard";

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function resolveDashboardDateRange(filters: DashboardFilters): {
  dateStart: string;
  dateEnd: string;
} {
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  if (filters.period === "custom" && filters.from && filters.to) {
    return { dateStart: filters.from, dateEnd: filters.to };
  }

  const start = new Date(end);

  switch (filters.period) {
    case "7d":
      start.setDate(start.getDate() - 6);
      break;
    case "30d":
      start.setDate(start.getDate() - 29);
      break;
    case "quarter": {
      const quarter = Math.floor(start.getMonth() / 3);
      start.setMonth(quarter * 3, 1);
      start.setHours(0, 0, 0, 0);
      break;
    }
    case "year":
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      break;
    default:
      start.setMonth(start.getMonth() - 5, 1);
      break;
  }

  return {
    dateStart: toIsoDate(start),
    dateEnd: toIsoDate(end),
  };
}
