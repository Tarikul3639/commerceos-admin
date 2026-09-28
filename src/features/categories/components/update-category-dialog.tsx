"use client"

import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { getErrorMessage } from "@/lib/utils/error"

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
  const [updateCategory, { isLoading }] =
    useUpdateCategoryMutation()

  const handleSubmit = async (data: CategoryFormValues) => {
    if (!category) {
      return
    }

    try {
      await updateCategory({
        id: category.id,
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description || undefined,
          isActive: data.isActive,
        },
      }).unwrap()

      toast.success("Category updated successfully")
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to update category", {
        description:
          getErrorMessage(error) || "Something went wrong.",
      })
    }
  }

  if (!category) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Category</DialogTitle>
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