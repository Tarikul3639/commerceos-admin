import { SettingsSectionPlaceholder } from "@/features/settings/components/settings-section-placeholder"

export default function NotificationSettingsPage() {
  return (
    <SettingsSectionPlaceholder
      title="Notification Settings"
      description="Manage operational email and in-app notification preferences."
      requirements="The current backend has notification delivery and email logs, but no persisted store-wide notification preference model. These controls are intentionally unavailable rather than presenting unsaved or non-functional switches."
    />
  )
}
