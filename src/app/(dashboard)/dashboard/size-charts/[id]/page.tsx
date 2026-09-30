import type { Metadata } from "next"

import { SizeChartDetails } from "@/features/size-charts/components/size-chart-details"

export const metadata: Metadata = {
    title: "Size Chart Details",
    description: "Manage size chart measurements.",
}

export default function SizeChartDetailsPage() {
    return <SizeChartDetails />
}