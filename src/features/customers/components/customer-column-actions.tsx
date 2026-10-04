"use client"

import { useState } from "react"

import { ArchiveRestore, Ellipsis, Info, SquarePen, Trash2 } from "lucide-react"

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
import { CustomerViewDialog } from "./customer-view-dialog"
import { UpdateCustomerDialog } from "./update-customer-dialog"
import { getErrorMessage } from "@/lib/utils/error"

import {
  useDeleteCustomerMutation,
  useRestoreCustomerMutation,
} from "../api/customers.api"

import { type Customer, CustomerStatus } from "../types/customers.types"

interface CustomerActionsProps {
  customer: Customer
}

export function CustomerColumnActions({ customer }: CustomerActionsProps) {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)

  const [deleteCustomer, { isLoading: isDeleting }] =
    useDeleteCustomerMutation()
  const [restoreCustomer, { isLoading: isRestoring }] =
    useRestoreCustomerMutation()

  const handleDelete = async () => {
    try {
      toast.promise(deleteCustomer(customer.id).unwrap(), {
        loading: "Deleting customer...",

        success: {
          message: "Customer deleted successfully",
          description: "The customer has been deleted successfully.",
        },

        error: (error) => ({
          message: "Failed to delete customer",
          description: getErrorMessage(error) || "Something went wrong.",
        }),
      })
    } catch {
      toast.error("Failed to delete customer")
    } finally {
      setIsDeleteDialogOpen(false)
    }
  }
  const handleRestore = () => {
    try {
      toast.promise(restoreCustomer(customer.id).unwrap(), {
        loading: "Restoring customer...",

        success: {
          message: "Customer restored successfully",
          description: "The customer has been restored successfully.",
        },

        error: (error) => ({
          message: "Failed to restore customer",
          description: getErrorMessage(error) || "Something went wrong.",
        }),
      })
    } catch {
      toast.error("Failed to restore customer")
    } finally {
      setIsRestoreDialogOpen(false)
    }
  }

  const isDeleted = customer.status === CustomerStatus.DELETED

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="size-8">
            <Ellipsis className="size-4" />

            <span className="sr-only">Open actions</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-38 pb-2">
          {/* General */}
          <DropdownMenuGroup>
            <DropdownMenuLabel>General</DropdownMenuLabel>

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

          {/* Customer Danger zone */}
          <DropdownMenuGroup>
            <DropdownMenuLabel>Danger</DropdownMenuLabel>

            {!isDeleted ? (
              <DropdownMenuItem
                variant="destructive"
                disabled={isDeleting || isRestoring}
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="size-4" />
                Delete
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                disabled={isDeleting || isRestoring}
                onClick={() => setIsRestoreDialogOpen(true)}
              >
                <ArchiveRestore className="size-4" />
                Restore
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Customer Details */}
      <CustomerViewDialog
        customer={customer}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
      />

      {/* Update Customer */}
      <UpdateCustomerDialog
        customer={customer}
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete customer?"
        description={
          <>
            Are you sure you want to delete <strong>{customer.name}</strong>?
          </>
        }
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />

      {/* Restore Confirmation */}
      <ConfirmDialog
        open={isRestoreDialogOpen}
        onOpenChange={setIsRestoreDialogOpen}
        title="Restore customer?"
        description={
          <>
            Are you sure you want to restore <strong>{customer.name}</strong>?
          </>
        }
        confirmLabel="Restore"
        onConfirm={handleRestore}
      />
    </>
  )
}
