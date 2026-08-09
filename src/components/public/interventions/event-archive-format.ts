import type { EventArchive } from "@/config/event-archives";

const dateFormatter = new Intl.DateTimeFormat("fr-CD", {
  dateStyle: "long",
});

export function formatEventDate(value: string | null): string {
  if (!value) return "Date à préciser";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return dateFormatter.format(date);
}

export function formatEventTime(value: string | null): string | null {
  if (!value) return null;
  return value.slice(0, 5);
}

export function formatEventLocation(event: EventArchive): string {
  return [
    event.locationName,
    event.locality && event.locality !== event.locationName ? event.locality : null,
    event.territory,
    event.province,
  ]
    .filter(Boolean)
    .join(", ");
}
