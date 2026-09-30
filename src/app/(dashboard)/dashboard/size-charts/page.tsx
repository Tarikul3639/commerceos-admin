import type { Metadata } from "next"

import { SizeChartsContent } from "@/features/size-charts/components/size-charts-content"

export const metadata: Metadata = {
    title: "Size Charts",
    description: "Manage product size charts.",
}

export default function SizeChartsPage() {
    return <SizeChartsContent />
}
