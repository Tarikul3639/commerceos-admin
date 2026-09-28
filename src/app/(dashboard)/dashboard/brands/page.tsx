import { Metadata } from "next"
import { BrandsContent } from "@/features/brands/components/brands-content"

export const metadata: Metadata = {
    title: "Brands",
    description: "Manage your product brands.",
}

export default function BrandsPage() {
    return <BrandsContent />
}
