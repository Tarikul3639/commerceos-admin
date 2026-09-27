"use client"

import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { CustomerForm } from "./customer-form"
import { useUpdateCustomerMutation } from "../api/customers.api"
import type { Customer } from "../types/customers.types"
import type { CustomerFormValues } from "../schemas/customer.schema"
import { getErrorMessage } from "@/lib/utils/error"

interface UpdateCustomerDialogProps {
  customer: Customer | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateCustomerDialog({
  customer,
  open,
  onOpenChange,
}: UpdateCustomerDialogProps) {
  const [updateCustomer, { isLoading }] = useUpdateCustomerMutation()

  const handleSubmit = async (data: CustomerFormValues) => {
    if (!customer) {
      return
    }

    try {
      await updateCustomer({
        id: customer.id,
        data: {
          ...data,
          email: data.email || undefined,
          phone: data.phone || undefined,
          avatarUrl: data.avatarUrl || undefined,
          publicId: data.publicId || undefined,
          address: data.address || undefined,
        },
      }).unwrap()

      toast.success("Customer updated successfully")
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to update customer", {
        description: getErrorMessage(error) || "Something went wrong.",
      })
    }
  }

  if (!customer) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Customer</DialogTitle>
        </DialogHeader>

        <CustomerForm
          customer={customer}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          submitLabel="Update"
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
