"use client"

import { useState } from "react"
import Link from "next/link"
import { Info, MoreHorizontal, SquarePen, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
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

import { useDeleteSizeChartMutation } from "../api/size-chart.api"
import type { SizeChart } from "../types/size-chart.types"
import { EditSizeChartDialog } from "./edit-size-chart-dialog"

const columnHelper = createColumnHelper<DataTableFeatures, SizeChart>()

function SizeChartActions({ sizeChart }: { sizeChart: SizeChart }) {
    const router = useRouter()

    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)

    const [deleteSizeChart, { isLoading: isDeleting }] =
        useDeleteSizeChartMutation()

    const handleDelete = async () => {
        try {
            await deleteSizeChart(sizeChart.id).unwrap()

            toast.success("Size chart deleted successfully")
            setDeleteOpen(false)
        } catch (error) {
            toast.error(getErrorMessage(error) || "Failed to delete size chart")
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
                        <DropdownMenuItem
                            onSelect={() =>
                                router.push(`/dashboard/size-charts/${sizeChart.id}`)
                            }
                        >
                            <Info />
                            Details
                        </DropdownMenuItem>

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

            <EditSizeChartDialog
                sizeChart={sizeChart}
                open={editOpen}
                onOpenChange={setEditOpen}
            />

            <ConfirmDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="Delete Size Chart?"
                description={`Are you sure you want to delete "${sizeChart.name}"? This action cannot be undone.`}
                confirmLabel={isDeleting ? "Deleting..." : "Delete"}
                cancelLabel="Cancel"
                onConfirm={() => void handleDelete()}
            />
        </>
    )
}

export const columns = columnHelper.columns([
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            const sizeChart = row.original
            return (
                <Link href={`/dashboard/size-charts/${sizeChart.id}`} className="group flex flex-col">
                    <span className="group-hover:underline font-medium">{sizeChart.name}</span>
                    <span className="text-sm text-muted-foreground">
                        {sizeChart.id}
                    </span>
                </Link>
            )
        }
    },
    {
        id: "items",
        header: "Sizes",
        cell: ({ row }) => row.original.items?.length ?? 0,
    },
    {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <SizeChartActions sizeChart={row.original} />,
    },
])
