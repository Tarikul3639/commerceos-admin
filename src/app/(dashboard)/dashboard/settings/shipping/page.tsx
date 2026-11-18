import { SettingsSectionPlaceholder } from "@/features/settings/components/settings-section-placeholder"

export default function ShippingSettingsPage() {
  return (
    <SettingsSectionPlaceholder
      title="Shipping Settings"
      description="Configure delivery availability, rates and free-shipping rules."
      requirements="The current backend Settings model has no shipping policy fields or shipping-rate API. These controls are intentionally unavailable until the shipping policy and checkout calculation rules are defined."
    />
  )
}
