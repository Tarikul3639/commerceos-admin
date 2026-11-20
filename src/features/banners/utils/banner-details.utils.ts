/** Formats nullable API timestamps for the banner details interface. */
export function formatDate(value: string | null) {
  return value
    ? new Date(value).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "Not scheduled"
}

/** Converts enum identifiers into readable labels for display. */
export function formatEnumLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ")
}

/** Describes the configured date range without implying live activation. */
export function getScheduleDescription(
  startAt: string | null,
  endAt: string | null
) {
  if (startAt && endAt) return "Banner has a defined start and end time."
  if (startAt) return "Banner has a start time but no end time."
  if (endAt) return "Banner has an end time but no start time."
  return "No display schedule has been set."
}
