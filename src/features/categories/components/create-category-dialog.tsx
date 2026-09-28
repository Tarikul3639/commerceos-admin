"use client"

import { toast } from "sonner"
import { Plus } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

import { getErrorMessage } from "@/lib/utils/error"

import { CategoryForm } from "./category-form"
import { useCreateCategoryMutation } from "../api/categories.api"
import type { CategoryFormValues } from "../schemas/category.schema"

interface CreateCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateCategoryDialog({
  open,
  onOpenChange,
}: CreateCategoryDialogProps) {
  const [createCategory, { isLoading }] = useCreateCategoryMutation()

  const handleSubmit = async (data: CategoryFormValues) => {
    try {
      await createCategory({
        name: data.name,
        slug: data.slug,
        description: data.description || undefined,
        isActive: data.isActive,
      }).unwrap()

      toast.success("Category created successfully")
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to create category", {
        description: getErrorMessage(error) || "Something went wrong.",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="default" size="sm">
                <Plus className="size-4" />
                Create
              </Button>
            </DialogTrigger>
          </TooltipTrigger>

          <TooltipContent>
            <p>Create a new category</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
        </DialogHeader>

        <CategoryForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          submitLabel="Create"
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
