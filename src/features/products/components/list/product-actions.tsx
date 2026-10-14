"use client"

import {
    EllipsisVertical,
    Info,
    RotateCcw,
    SquarePen,
    Trash2,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

import { Permission } from "@/config/permissions.config"
import { usePermission } from "@/hooks/use-permission"

import { ConfirmDialog } from "@/components/dialogs"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    useDeleteProductMutation,
    useRestoreProductMutation,
} from "../../api/product.api"

import type { ProductListItem } from "../../types/product.types"

export function ProductActions({ product }: { product: ProductListItem }) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation()

    const [restoreProduct, { isLoading: isRestoring }] =
        useRestoreProductMutation()

    const { has } = usePermission()

    const isDeleted = Boolean(product.deletedAt)

    const canDelete = has(Permission.PRODUCT_DELETE)
    const canRestore = has(Permission.PRODUCT_RESTORE)
    const canUpdate = has(Permission.PRODUCT_UPDATE)

    /** Soft delete a product. */
    const onConfirmDelete = async () => {
        try {
            await deleteProduct(product.id).unwrap()

            toast.success("Product deleted successfully")
            setIsDeleteDialogOpen(false)
        } catch {
            toast.error("Failed to delete product")
        }
    }

    /** Restore a soft-deleted product. */
    const onRestore = async () => {
        try {
            await restoreProduct(product.id).unwrap()

            toast.success("Product restored successfully")
        } catch {
            toast.error("Failed to restore product")
        }
    }

    // Hide the action menu when the user has no applicable permissions.
    if ((isDeleted && !canRestore) || (!isDeleted && !canDelete && !canUpdate)) {
        return null
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                        <EllipsisVertical className="size-4" />
                        <span className="sr-only">Open actions</span>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="p-1">
                    <DropdownMenuLabel>Product</DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                        <Link href={`/dashboard/products/${product.id}`}>
                            <Info className="size-4" />
                            Details
                        </Link>
                    </DropdownMenuItem>

                    {isDeleted ? (
                        canRestore && (
                            <DropdownMenuItem disabled={isRestoring} onClick={onRestore}>
                                <RotateCcw className="size-4" />
                                {isRestoring ? "Restoring..." : "Restore"}
                            </DropdownMenuItem>
                        )
                    ) : (
                        <>
                            {canUpdate && (
                                <DropdownMenuItem asChild>
                                    <Link href={`/dashboard/products/${product.id}/update`}>
                                        <SquarePen className="size-4" />
                                        Update
                                    </Link>
                                </DropdownMenuItem>
                            )}

                            {canDelete && (
                                <>
                                    {canUpdate && <DropdownMenuSeparator />}

                                    <DropdownMenuItem
                                        variant="destructive"
                                        onClick={() => setIsDeleteDialogOpen(true)}
                                    >
                                        <Trash2 className="size-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </>
                            )}
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            {canDelete && !isDeleted && (
                <ConfirmDialog
                    title="Delete product"
                    description="Are you sure you want to delete this product?"
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                    onConfirm={onConfirmDelete}
                    isLoading={isDeleting}
                />
            )}
        </>
    )
}
