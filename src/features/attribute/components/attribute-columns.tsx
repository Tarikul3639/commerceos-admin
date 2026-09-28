"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import type { DataTableFeatures } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { AttributeActions } from "./attribute-actions"
import type { Attribute } from "../types/attribute.types"

export const columnHelper = createColumnHelper<DataTableFeatures, Attribute>()

export const columns = columnHelper.columns([
    {
        accessorKey: "name",

        header: ({ column }) => (
            <Button
                variant="ghost"
                className="-ml-3"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Attribute
                <ArrowUpDown className="ml-2 size-4" />
            </Button>
        ),

        cell: ({ row }) => {
            const attribute = row.original

            return (
                <div className="min-w-0">
                    <div className="truncate font-medium">{attribute.name}</div>

                    <div
                        title={attribute.id}
                        className="truncate text-xs text-muted-foreground"
                    >
                        {attribute.id}
                    </div>
                </div>
            )
        },
    },

    {
        accessorKey: "values",

        header: "Values",

        cell: ({ row }) => {
            const values = row.original.values

            if (!values.length) {
                return (
                    <span className="text-muted-foreground">
                        No values
                    </span>
                )
            }

            const visibleValues = values.slice(0, 3)
            const remainingCount = values.length - visibleValues.length

            return (
                <div className="flex items-center gap-1">
                    {visibleValues.map((item) => (
                        <Badge
                            key={item.id}
                            variant="outline"
                        >
                            {item.value}
                        </Badge>
                    ))}

                    {remainingCount > 0 && (
                        <Badge variant="secondary">
                            +{remainingCount}
                        </Badge>
                    )}
                </div>
            )
        },
    },

    {
        accessorKey: "createdAt",

        header: ({ column }) => (
            <Button
                variant="ghost"
                className="-ml-3"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Created
                <ArrowUpDown className="ml-2 size-4" />
            </Button>
        ),

        cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },

    {
        accessorKey: "updatedAt",

        header: ({ column }) => (
            <Button
                variant="ghost"
                className="-ml-3"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Updated
                <ArrowUpDown className="ml-2 size-4" />
            </Button>
        ),

        cell: ({ row }) => new Date(row.original.updatedAt).toLocaleDateString(),
    },

    {
        id: "actions",

        header: "Actions",

        size: 80,
        minSize: 80,
        maxSize: 80,

        cell: ({ row }) => {
            const attribute = row.original

            return <AttributeActions attribute={attribute} />
        },
    },
])
