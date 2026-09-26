import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createColumnHelper } from "@tanstack/react-table"
import { DataTableFeatures } from "@/components/data-table"
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

            return (
                <span className="block truncate text-sm">
                    {role || "—"}
                </span>
            )
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
            const role = row.original.role

            return (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                        // open edit permissions
                        console.log("Edit permissions:", role)
                    }}
                    className="h-8 w-8 p-0 data-[state=open]:bg-accent"
                >
                    <Pencil className="size-4" />
                    <span className="sr-only">Edit {role} permissions</span>
                </Button>
            )
        },
    }),
])
