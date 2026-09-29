"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import type { DataTableFeatures } from "@/components/data-table"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"
import { getErrorMessage } from "@/lib/utils/error"

import { useRemoveProductDiscountMutation } from "../api/discount.api"
import type { DiscountProduct } from "../types/discount.types"

export const columnHelper = createColumnHelper<
    DataTableFeatures,
    DiscountProduct
>()

export const columns = (discountId: string) =>
    columnHelper.columns([
        {
            accessorKey: "name",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    className="-ml-3"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Product
                    <ArrowUpDown className="ml-2 size-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const product = row.original

                return (
                    <div className="flex flex-col">
                        <span className="font-medium">{product.name}</span>

                        <span className="text-xs text-muted-foreground">{product.id}</span>
                    </div>
                )
            },
        },

        {
            accessorKey: "slug",
            header: "Slug",
            cell: ({ row }) => (
                <span className="text-muted-foreground">{row.original.slug}</span>
            ),
        },

        {
            accessorKey: "thumbnail",
            header: "Thumbnail",
            cell: ({ row }) => {
                const thumbnail = row.original.thumbnail

                return thumbnail ? (
                    <img
                        src={thumbnail}
                        alt={row.original.name}
                        className="size-10 rounded-md object-cover"
                    />
                ) : (
                    <div className="flex size-10 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
                        —
                    </div>
                )
            },
        },

        {
            id: "actions",
            header: "Actions",
            size: 80,
            minSize: 80,
            maxSize: 80,
            cell: ({ row }) => {
                const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false)

                const [removeProductDiscount, { isLoading: isRemoving }] =
                    useRemoveProductDiscountMutation()

                const product = row.original

                const handleRemove = async () => {
                    try {
                        await removeProductDiscount({
                            discountId,
                            productId: product.id,
                        }).unwrap()

                        toast.success("Product removed from discount successfully")

                        setIsRemoveDialogOpen(false)
                    } catch (error) {
                        toast.error("Failed to remove product", {
                            description: getErrorMessage(error) || "Something went wrong.",
                        })
                    }
                }

                return (
                    <>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="icon">
                                    <MoreHorizontal className="size-4" />
                                    <span className="sr-only">Open actions</span>
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    variant="destructive"
                                    onClick={() => setIsRemoveDialogOpen(true)}
                                >
                                    <Trash2 className="size-4" />
                                    Remove
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <ConfirmDialog
                            open={isRemoveDialogOpen}
                            onOpenChange={setIsRemoveDialogOpen}
                            title="Remove Product"
                            description={
                                <>
                                    Are you sure you want to remove{" "}
                                    <strong>{product.name}</strong> from this discount?
                                </>
                            }
                            confirmLabel={isRemoving ? "Removing..." : "Remove"}
                            cancelLabel="Cancel"
                            onConfirm={handleRemove}
                        />
                    </>
                )
            },
        },
    ])
