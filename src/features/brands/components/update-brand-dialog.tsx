"use client"

import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { useUpdateBrandMutation } from "../api/brands.api"
import type { BrandFormValues } from "../schemas/brand.schema"
import type { Brand } from "../types/brands.types"
import { BrandForm } from "./brand-form"

interface UpdateBrandDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  brand: Brand | null
}

export function UpdateBrandDialog({
  open,
  onOpenChange,
  brand,
}: UpdateBrandDialogProps) {
  const [updateBrand, { isLoading }] = useUpdateBrandMutation()

  const handleSubmit = async (data: BrandFormValues) => {
    if (!brand) return

    try {
      await updateBrand({
        id: brand.id,
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description || undefined,
          image: data.image || undefined,
          isActive: data.isActive,
        },
      }).unwrap()

      toast.success("Brand updated successfully")

      onOpenChange(false)
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Failed to update brand")
    }
  }

  if (!brand) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Brand</DialogTitle>
          <DialogDescription>Update the brand information.</DialogDescription>
        </DialogHeader>

        <BrandForm
          key={brand.id}
          brand={brand}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          submitLabel="Update"
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
