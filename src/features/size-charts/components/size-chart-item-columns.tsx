"use client"

import { useState } from "react"
import { MoreHorizontal, SquarePen, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { createColumnHelper } from "@tanstack/react-table"

import type { DataTableFeatures } from "@/components/data-table"
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getErrorMessage } from "@/lib/utils/error"

import { useDeleteSizeChartItemMutation } from "../api/size-chart.api"
import type { SizeChartItem } from "../types/size-chart.types"
import { EditSizeChartItemDialog } from "./edit-size-chart-item-dialog"

const columnHelper = createColumnHelper<DataTableFeatures, SizeChartItem>()

const measurementFields = [
    "chest",
    "length",
    "shoulder",
    "sleeve",
    "waist",
    "hip",
    "inseam",
] as const

function SizeChartItemActions({ item }: { item: SizeChartItem }) {
    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)

    const [deleteItem, { isLoading: isDeleting }] =
        useDeleteSizeChartItemMutation()

    const handleDelete = async () => {
        try {
            await deleteItem({
                sizeChartId: item.sizeChartId,
                itemId: item.id,
            }).unwrap()

            toast.success("Size deleted successfully")
            setDeleteOpen(false)
        } catch (error) {
            toast.error(getErrorMessage(error) || "Failed to delete size")
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon">
                        <MoreHorizontal />
                        <span className="sr-only">Open actions</span>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="p-1">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                    <DropdownMenuGroup>
                        <DropdownMenuItem onSelect={() => setEditOpen(true)}>
                            <SquarePen />
                            Update
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            className="text-destructive"
                            onSelect={() => setDeleteOpen(true)}
                        >
                            <Trash2 />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <EditSizeChartItemDialog
                sizeChartId={item.sizeChartId}
                item={item}
                open={editOpen}
                onOpenChange={setEditOpen}
            />

            <ConfirmDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="Delete Size?"
                description={`Are you sure you want to delete size "${item.size}"? This action cannot be undone.`}
                confirmLabel={isDeleting ? "Deleting..." : "Delete"}
                cancelLabel="Cancel"
                onConfirm={() => void handleDelete()}
            />
        </>
    )
}

export const sizeChartItemColumns = columnHelper.columns([
    {
        accessorKey: "size",
        header: "Size",
        cell: ({ row }) => <span className="font-medium">{row.original.size}</span>,
    },
    ...measurementFields.map((field) => ({
        accessorKey: field,
        header: field.charAt(0).toUpperCase() + field.slice(1),
        cell: ({ row }: { row: { original: SizeChartItem } }) =>
            row.original[field] ?? "—",
    })),
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <SizeChartItemActions item={row.original} />,
    },
])
