"use client"

import { useState } from "react"
import { Info, MoreHorizontal, SquarePen, Trash2 } from "lucide-react"
import { toast } from "sonner"

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

import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"

import { getErrorMessage } from "@/lib/utils/error"

import type { Attribute } from "../types/attribute.types"
import { useDeleteAttributeMutation } from "../api/attribute.api"
import { AttributeDetailsDialog } from "./attribute-details-dialog"
import { UpdateAttributeDialog } from "./update-attribute-dialog"

interface AttributeActionsProps {
  attribute: Attribute
}

export function AttributeActions({ attribute }: AttributeActionsProps) {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const [deleteAttribute, { isLoading: isDeleting }] =
    useDeleteAttributeMutation()

  const handleDelete = async () => {
    try {
      await deleteAttribute(attribute.id).unwrap()

      toast.success("Attribute deleted successfully")

      setIsDeleteDialogOpen(false)
    } catch (error) {
      toast.error("Failed to delete attribute", {
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
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => setIsViewDialogOpen(true)}>
              <Info className="size-4" />
              Details
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => setIsUpdateDialogOpen(true)}>
              <SquarePen className="size-4" />
              Update
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel>Danger</DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <AttributeDetailsDialog
        attribute={attribute}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
      />

      <UpdateAttributeDialog
        attribute={attribute}
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Attribute"
        description={
          <>
            Are you sure you want to delete <strong>{attribute.name}</strong>?
            This action cannot be undone.
          </>
        }
        confirmLabel={isDeleting ? "Deleting..." : "Delete"}
        cancelLabel="Cancel"
        onConfirm={handleDelete}
      />
    </>
  )
}
