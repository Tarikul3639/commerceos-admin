import { SettingsSectionPlaceholder } from "@/features/settings/components/settings-section-placeholder"

export default function SecuritySettingsPage() {
  return (
    <SettingsSectionPlaceholder
      title="Security Settings"
      description="Review authentication and account-security policy."
      requirements="Session lifetime, password policy and login lockout are currently controlled by authentication configuration and flows, not by the Settings record. Runtime security controls need a separate design so changing a dashboard value cannot falsely imply that authentication enforcement changed."
    />
  )
}
