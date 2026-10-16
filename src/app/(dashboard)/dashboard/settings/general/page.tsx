import type { Metadata } from "next"

import { GeneralSettingsContent } from "@/features/settings/components/general/general-settings-content"

export const metadata: Metadata = {
    title: "General Settings",
    description: "Manage your company information and store preferences.",
}

export default function GeneralSettingsPage() {
    return <GeneralSettingsContent />
}
