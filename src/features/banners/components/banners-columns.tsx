"use client"

import { useState } from "react"
import { createColumnHelper } from "@tanstack/react-table"
import { Info, MoreHorizontal, SquarePen, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { DataTableFeatures } from "@/components/data-table"
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"
import { AppImage } from "@/components/media"
import { Permission } from "@/config/permissions.config"
import { usePermission } from "@/hooks/use-permission"
import { getErrorMessage } from "@/lib/utils/error"
import { Badge } from "@/components/ui/badge"
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
import { useDeleteBannerMutation } from "../api/banners.api"
import type { Banner } from "../types/banners.types"
import { BannerDetailsDialog } from "./banner-details-dialog"
import { UpdateBannerDialog } from "./update-banner-dialog"

const helper = createColumnHelper<DataTableFeatures, Banner>()

export const columns = helper.columns([
  helper.accessor("imageUrl", {
    header: "Image",
    cell: ({ row }) => (
      <AppImage
        name={row.original.title ?? "Banner"}
        image={row.original.imageUrl}
        className="h-12 w-20 rounded-md"
      />
    ),
  }),
  helper.accessor("title", {
    header: "Title",
    cell: ({ getValue }) => (
      <span className="font-medium">{getValue() || "Untitled banner"}</span>
    ),
  }),
  helper.accessor("type", {
    header: "Type",
    cell: ({ getValue }) => formatEnumLabel(getValue()),
  }),
  helper.accessor("position", {
    header: "Position",
    cell: ({ getValue }) => formatEnumLabel(getValue()),
  }),
  helper.accessor("isActive", {
    header: "Status",
    cell: ({ getValue }) => (
      <Badge variant={getValue() ? "default" : "secondary"}>
        {getValue() ? "Active" : "Inactive"}
      </Badge>
    ),
  }),
  helper.accessor("sortOrder", {
    header: "Order",
    cell: ({ getValue }) => <span className="tabular-nums">{getValue()}</span>,
  }),
  helper.accessor("startAt", {
    header: "Starts",
    cell: ({ getValue }) => formatDate(getValue()),
  }),
  helper.accessor("endAt", {
    header: "Ends",
    cell: ({ getValue }) => formatDate(getValue()),
  }),
  helper.display({
    id: "actions",
    header: "Actions",
    size: 80,
    minSize: 80,
    maxSize: 80,
    cell: ({ row }) => {
      const banner = row.original
      const [viewOpen, setViewOpen] = useState(false)
      const [editOpen, setEditOpen] = useState(false)
      const [deleteOpen, setDeleteOpen] = useState(false)
      const [deleteBanner, { isLoading: isDeleting }] =
        useDeleteBannerMutation()
      const permission = usePermission()
      const canRead = permission.has(Permission.BANNER_READ)
      const canUpdate = permission.has(Permission.BANNER_UPDATE)
      const canDelete = permission.has(Permission.BANNER_DELETE)

      const handleDelete = async () => {
        try {
          await deleteBanner(banner.id).unwrap()
          toast.success("Banner deleted successfully")
          setDeleteOpen(false)
        } catch (error) {
          toast.error(getErrorMessage(error) || "Failed to delete banner")
        }
      }

      if (!canRead && !canUpdate && !canDelete) return null

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Open banner actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {canRead && (
                  <DropdownMenuItem onClick={() => setViewOpen(true)}>
                    <Info />
                    Details
                  </DropdownMenuItem>
                )}
                {canUpdate && (
                  <DropdownMenuItem onClick={() => setEditOpen(true)}>
                    <SquarePen />
                    Update
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
              {canDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Danger</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => setDeleteOpen(true)}
                    >
                      <Trash2 />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          {canRead && (
            <BannerDetailsDialog
              banner={banner}
              open={viewOpen}
              onOpenChange={setViewOpen}
            />
          )}
          {canUpdate && (
            <UpdateBannerDialog
              banner={banner}
              open={editOpen}
              onOpenChange={setEditOpen}
            />
          )}
          {canDelete && (
            <ConfirmDialog
              open={deleteOpen}
              onOpenChange={setDeleteOpen}
              title="Delete banner"
              description={
                <>
                  Delete <strong>{banner.title || "this banner"}</strong>? Its
                  Cloudinary images will also be deleted.
                </>
              }
              confirmLabel={isDeleting ? "Deleting..." : "Delete"}
              onConfirm={handleDelete}
            />
          )}
        </>
      )
    },
  }),
])

function formatDate(value: string | null) {
  return value ? new Date(value).toLocaleDateString() : "—"
}

function formatEnumLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ")
}
