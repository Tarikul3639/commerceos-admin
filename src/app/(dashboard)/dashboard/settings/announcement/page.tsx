import { redirect } from "next/navigation"

export default function LegacyAnnouncementSettingsPage() {
  redirect("/dashboard/features/announcement")
}
