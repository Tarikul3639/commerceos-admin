import { useState } from "react"
import { createColumnHelper } from "@tanstack/react-table"
import { DataTableFeatures } from "@/components/data-table"
import { EditPermissionsDialog } from "./edit-permissions-dialog"
import type { RolePermissions } from "../types/permissions.types"

export const columnHelper = createColumnHelper<
    DataTableFeatures,
    RolePermissions
>()

export const columns = columnHelper.columns([
    columnHelper.accessor("role", {
        header: "Role",
        size: 12,
        sortFn: "sortFn_text",
        cell: (info) => {
            const role = info.getValue()

            return <span className="block truncate text-sm">{role || "—"}</span>
        },
    }),

    columnHelper.accessor("permissions", {
        header: "Permissions",
        sortFn: "sortFn_text",
        cell: (info) => {
            const permissions = info.getValue()

            return (
                <span className="block truncate text-sm">
                    {permissions.join(", ") || "—"}
                </span>
            )
        },
    }),

    columnHelper.display({
        id: "actions",
        header: "Action",
        size: 12,
        minSize: 12,
        maxSize: 12,
        cell: ({ row }) => {
            const [isOpen, setIsOpen] = useState(false)
            const role = row.original.role

            return (
                <EditPermissionsDialog
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    rolePermissions={row.original}
                />
            )
        },
    }),
])
