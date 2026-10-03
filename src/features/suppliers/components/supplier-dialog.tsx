"use client"

import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
} from "../api/supplier.api"
import type { Supplier, SupplierRequest } from "../types/supplier.types"
import { SupplierForm } from "./supplier-form"
import type { SupplierFormValues } from "../schemas/supplier.schema"

export function SupplierDialog({
  open,
  onOpenChange,
  supplier,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier?: Supplier | null
}) {
  const [createSupplier, createState] = useCreateSupplierMutation()
  const [updateSupplier, updateState] = useUpdateSupplierMutation()
  const isLoading = createState.isLoading || updateState.isLoading
  const submit = async (values: SupplierFormValues) => {
    const data: SupplierRequest = {
      name: values.name,
    }
    if (supplier) data.isActive = values.isActive
    if (values.email) data.email = values.email
    if (values.phone) data.phone = values.phone
    if (values.address) data.address = values.address
    if (values.contactPerson) data.contactPerson = values.contactPerson
    try {
      if (supplier) await updateSupplier({ id: supplier.id, data }).unwrap()
      else await createSupplier(data).unwrap()
      toast.success(
        supplier
          ? "Supplier updated successfully"
          : "Supplier created successfully"
      )
      onOpenChange(false)
    } catch (error) {
      toast.error("Unable to save supplier", {
        description:
          (error as { data?: { message?: string } })?.data?.message ??
          "Please try again.",
      })
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {supplier ? "Update supplier" : "Create supplier"}
          </DialogTitle>
          <DialogDescription>
            {supplier
              ? "Update supplier contact information."
              : "Add a supplier to your business."}
          </DialogDescription>
        </DialogHeader>
        <SupplierForm
          key={supplier?.id ?? "new"}
          supplier={supplier}
          onSubmit={submit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
