import { Metadata } from "next"
import { AttributeContent } from "@/features/attribute/components/attribute-content"

export const metadata: Metadata = {
    title: "Attributes",
    description: "Manage your product attributes.",
}

export default function AttributePage() {
    return <AttributeContent />
}