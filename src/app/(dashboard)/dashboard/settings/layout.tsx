import type { ReactNode } from "react"

import { SettingsLayout as SettingsNavigationLayout } from "@/features/settings/components/settings-layout"

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return <SettingsNavigationLayout>{children}</SettingsNavigationLayout>
}
