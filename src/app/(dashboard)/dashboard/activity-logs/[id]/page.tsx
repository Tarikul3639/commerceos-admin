import type { Metadata } from "next"

import { ActivityLogDetailsContent } from "@/features/activity-logs/components/activity-log-details-content"

export const metadata: Metadata = {
  title: "Activity Log Details",
  description: "View activity information, changes, and request metadata.",
}

export default function ActivityLogDetailsPage() {
  return <ActivityLogDetailsContent />
}
