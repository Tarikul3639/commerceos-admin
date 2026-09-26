import { Metadata } from "next"
import { PermissionsContent } from "@/features/permissions/components/permissions-content"

export const metadata: Metadata = {
    title: "Dashboard Permissions",
    description: "Manage dashboard permissions",
}

export default function PermissionsPage() {
    return <PermissionsContent />
}
