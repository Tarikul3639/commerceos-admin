import type { Metadata } from "next"

import { AnnouncementSettingsContent } from "@/features/announcement/components/announcement-settings-content"

export const metadata: Metadata = {
  title: "Announcement Settings",
  description: "Manage the announcement displayed across your storefront.",
}

export default function AnnouncementSettingsPage() {
  return <AnnouncementSettingsContent />
}
