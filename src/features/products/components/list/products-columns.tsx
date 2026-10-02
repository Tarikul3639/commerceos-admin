import { useState } from "react"
import { createColumnHelper } from "@tanstack/react-table"
import {
  EllipsisVertical,
  SquarePen,
  Trash2,
  Info,
  RotateCcw,
} from "lucide-react"
import { TakaIcon } from "@/components/icons/taka-icon"

import { DataTableFeatures } from "@/components/data-table"
import { AppImage } from "@/components/media"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ConfirmDialog } from "@/components/dialogs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import Link from "next/link"

import {
  useDeleteProductMutation,
  useRestoreProductMutation,
} from "../../api/product.api"
import type { Product } from "../../types/product.types"
export const columnHelper = createColumnHelper<DataTableFeatures, Product>()

export const columns = columnHelper.columns([
  {
    accessorKey: "name",
    header: "Product",
    cell: (info) => {
      const product = info.row.original

      return (
        <div className="flex items-center gap-3">
          <AppImage
            image={product.image}
            name={product.name}
            className="size-14 rounded-md after:hidden"
          />

          <div className="min-w-0">
            <Link
              href={`/dashboard/products/${product.id}`}
              className="truncate font-medium hover:text-primary hover:underline"
            >
              {product.name}
            </Link>

            {product.subDescription && (
              <p className="truncate text-xs text-muted-foreground">
                {product.subDescription}
              </p>
            )}
          </div>
        </div>
      )
    },
  },

  {
    accessorKey: "category",
    header: "Category",
    cell: (info) => {
      const product = info.row.original

      return (
        <div>
          <p className="font-medium">{product.category.name}</p>

          {product.brand && (
            <p className="text-xs text-muted-foreground">
              {product.brand.name}
            </p>
          )}
        </div>
      )
    },
  },

  {
    accessorKey: "sellingPrice",
    header: "Pricing",
    cell: (info) => {
      const product = info.row.original

      return (
        <div>
          <p className="flex items-center font-medium">
            <TakaIcon className="size-4" />
            {Number(product.sellingPrice).toFixed(2)}
          </p>

          <p className="flex items-center text-xs text-muted-foreground">
            Cost: <TakaIcon className="size-3" />
            {Number(product.purchasePrice).toFixed(2)}
          </p>
        </div>
      )
    },
  },

  {
    accessorKey: "stock",
    header: "Stock",
    cell: (info) => {
      const stock = info.getValue()
      const progress = Math.min(stock, 100)

      const progressColor =
        stock < 5
          ? "[&>div]:bg-destructive"
          : stock < 20
            ? "[&>div]:bg-yellow-500"
            : stock < 50
              ? "[&>div]:bg-blue-500"
              : "[&>div]:bg-green-500"

      return (
        <div className="w-20 space-y-1">
          <Progress value={progress} className={`h-1.5 ${progressColor}`} />

          <p className="text-center text-xs text-muted-foreground tabular-nums">
            {stock === 0 ? "Out of stock" : `${stock} in stock`}
          </p>
        </div>
      )
    },
  },

  {
    accessorKey: "isActive",
    header: "Status",
    cell: (info) => {
      const product = info.row.original

      return (
        <div className="flex flex-col items-center gap-2">
          <Badge variant={product.isActive ? "default" : "secondary"}>
            {product.isActive ? "Active" : "Inactive"}
          </Badge>

          <span className="text-xs text-muted-foreground">{product.sku}</span>
        </div>
      )
    },
  },

  {
    accessorKey: "createdAt",
    header: "Created",
    cell: (info) => {
      const date = new Date(info.getValue())

      return (
        <div>
          <p className="text-sm">{date.toLocaleDateString()}</p>

          <p className="text-xs text-muted-foreground">
            {date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      )
    },
  },

  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    enableColumnFilter: false,
    cell: (info) => {
      const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
      const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false)

      const [deleteProduct] = useDeleteProductMutation()
      const [restoreProduct] = useRestoreProductMutation()

      const product = info.row.original
      const isDeleted = Boolean(product.deletedAt)

      const onConfirmDelete = async () => {
        try {
          await deleteProduct(product.id).unwrap()
          toast.success("Product deleted successfully")
        } catch {
          toast.error("Failed to delete product")
        }
      }

      const onConfirmRestore = async () => {
        try {
          await restoreProduct(product.id).unwrap()
          toast.success("Product restored successfully")
        } catch {
          toast.error("Failed to restore product")
        }
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

              {!isDeleted && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/products/${product.id}/edit`}>
                      <SquarePen className="size-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}

              {isDeleted && (
                <DropdownMenuItem onClick={() => setIsRestoreDialogOpen(true)}>
                  <RotateCcw className="size-4" />
                  Restore
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <ConfirmDialog
            title="Delete product"
            description="Are you sure you want to delete this product?"
            onOpenChange={setIsDeleteDialogOpen}
            open={isDeleteDialogOpen}
            onConfirm={onConfirmDelete}
          />

          <ConfirmDialog
            title="Restore product"
            description="Are you sure you want to restore this product?"
            onOpenChange={setIsRestoreDialogOpen}
            open={isRestoreDialogOpen}
            onConfirm={onConfirmRestore}
          />
        </>
      )
    },
  },
])
