"use client"

import { useState } from "react"
import { createColumnHelper } from "@tanstack/react-table"
import {
    ArrowUpDown,
    Info,
    MoreHorizontal,
    SquarePen,
    Trash2,
} from "lucide-react"
import { toast } from "sonner"

import type { DataTableFeatures } from "@/components/data-table"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { AppImage } from "@/components/media"

import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"
import { ViewBrandDialog } from "./view-brand-dialog"
import { UpdateBrandDialog } from "./update-brand-dialog"
import { useDeleteBrandMutation } from "../api/brands.api"
import type { Brand } from "../types/brands.types"
import { getErrorMessage } from "@/lib/utils/error"

export const columnHelper = createColumnHelper<DataTableFeatures, Brand>()

export const columns = columnHelper.columns([
    {
        accessorKey: "name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="-ml-3"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Brand
                <ArrowUpDown className="ml-2 size-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const brand = row.original

            return (
                <div className="flex min-w-0 items-center gap-3">
                    <AppImage
                        name={brand.name}
                        image={brand.image}
                        className="size-9"
                    />

                    <div className="min-w-0">
                        <div className="truncate font-medium">
                            {brand.name}
                        </div>

                        <div title={brand.id} className="truncate text-xs text-muted-foreground">
                            {brand.id}
                        </div>
                    </div>
                </div>
            )
        },
    },

    {
        accessorKey: "slug",
        header: "Slug",
        cell: ({ row }) => (
            <span className="text-muted-foreground">
                {row.original.slug}
            </span>
        ),
    },

    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
            <div className="max-w-[300px] truncate text-muted-foreground">
                {row.original.description || "—"}
            </div>
        ),
    },

    {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => {
            const isActive = row.original.isActive

            return (
                <Badge variant={isActive ? "default" : "secondary"}>
                    {isActive ? "Active" : "Inactive"}
                </Badge>
            )
        },
    },

    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="-ml-3"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Created
                <ArrowUpDown className="ml-2 size-4" />
            </Button>
        ),
        cell: ({ row }) =>
            new Date(row.original.createdAt).toLocaleDateString(),
    },

    {
        id: "actions",
        header: "Actions",
        size: 80,
        minSize: 80,
        maxSize: 80,
        cell: ({ row }) => {
            const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
            const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
            const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

            const [deleteBrand, { isLoading: isDeleting }] =
                useDeleteBrandMutation()

            const brand = row.original

            const handleDelete = async () => {
                try {
                    await deleteBrand(brand.id).unwrap()

                    toast.success("Brand deleted successfully")
                    setIsDeleteDialogOpen(false)
                } catch (error) {
                    toast.error("Failed to delete brand", {
                        description:
                            getErrorMessage(error) ||
                            "Something went wrong.",
                    })
                }
            }

            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon">
                                <MoreHorizontal className="size-4" />
                                <span className="sr-only">
                                    Open actions
                                </span>
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuGroup>
                                <DropdownMenuLabel>
                                    Actions
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    onClick={() =>
                                        setIsViewDialogOpen(true)
                                    }
                                >
                                    <Info className="size-4" />
                                    Details
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() =>
                                        setIsUpdateDialogOpen(true)
                                    }
                                >
                                    <SquarePen className="size-4" />
                                    Update
                                </DropdownMenuItem>
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator />

                            <DropdownMenuGroup>
                                <DropdownMenuLabel>
                                    Danger
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    variant="destructive"
                                    onClick={() =>
                                        setIsDeleteDialogOpen(true)
                                    }
                                >
                                    <Trash2 className="size-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <ViewBrandDialog
                        brand={brand}
                        open={isViewDialogOpen}
                        onOpenChange={setIsViewDialogOpen}
                    />

                    <UpdateBrandDialog
                        brand={brand}
                        open={isUpdateDialogOpen}
                        onOpenChange={setIsUpdateDialogOpen}
                    />

                    <ConfirmDialog
                        open={isDeleteDialogOpen}
                        onOpenChange={setIsDeleteDialogOpen}
                        title="Delete Brand"
                        description={
                            <>
                                Are you sure you want to delete{" "}
                                <strong>{brand.name}</strong>
                                ? This action cannot be undone.
                            </>
                        }
                        confirmLabel={
                            isDeleting ? "Deleting..." : "Delete"
                        }
                        cancelLabel="Cancel"
                        onConfirm={handleDelete}
                    />
                </>
            )
        },
    },
])