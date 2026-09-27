"use client"

import { toast } from "sonner"
import { Plus } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { Button } from "@/components/ui/button"
import { getErrorMessage } from "@/lib/utils/error"
import { CustomerForm } from "./customer-form"

import { useCreateCustomerMutation } from "../api/customers.api"
import type { CustomerFormValues } from "../schemas/customer.schema"

interface CreateCustomerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateCustomerDialog({
  open,
  onOpenChange,
}: CreateCustomerDialogProps) {
  const [createCustomer, { isLoading }] = useCreateCustomerMutation()

  const handleSubmit = async (data: CustomerFormValues) => {
    try {
      await createCustomer({
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        avatarUrl: data.avatarUrl || undefined,
        publicId: data.publicId || undefined,
        address: data.address || undefined,
      }).unwrap()

      toast.success("Customer created successfully!")

      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to create customer", {
        description: getErrorMessage(error) || "Something went wrong.",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="default" size="sm">
              <Plus />
              Create
            </Button>
          </DialogTrigger>
        </TooltipTrigger>

        <TooltipContent>
          <p>Create a new customer</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent className="max-w-lg">
        <DialogHeader className="gap-1.5">
          <DialogTitle>Create Customer</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new customer.
          </DialogDescription>
        </DialogHeader>

        <CustomerForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          submitLabel="Create"
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
