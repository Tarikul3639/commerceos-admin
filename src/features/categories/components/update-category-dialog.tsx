"use client"

import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { getErrorMessage } from "@/lib/utils/error"
import { Permission } from "@/config/permissions.config"
import { usePermission } from "@/hooks/use-permission"

import { CategoryForm } from "./category-form"
import { useUpdateCategoryMutation } from "../api/categories.api"
import type { CategoryFormValues } from "../schemas/category.schema"
import type { Category } from "../types/categories.types"

interface UpdateCategoryDialogProps {
  category: Category | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateCategoryDialog({
  category,
  open,
  onOpenChange,
}: UpdateCategoryDialogProps) {
  const canUpdate = usePermission().has(Permission.CATEGORY_UPDATE)
  const [updateCategory, { isLoading }] = useUpdateCategoryMutation()

  const handleSubmit = async (data: CategoryFormValues) => {
    if (!canUpdate || !category) {
      return
    }

    try {
      await updateCategory({
        id: category.id,
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description || undefined,
          image: data.image || null,
          publicId: data.publicId || null,
          isActive: data.isActive,
        },
      }).unwrap()

      toast.success("Category updated successfully")
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to update category", {
        description: getErrorMessage(error) || "Something went wrong.",
      })
    }
  }

  if (!canUpdate || !category) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Category</DialogTitle>
          <DialogDescription>
            Update the details of the category below.
          </DialogDescription>
        </DialogHeader>

        <CategoryForm
          category={category}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          submitLabel="Update"
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
