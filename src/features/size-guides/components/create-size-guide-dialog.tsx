"use client"

import { Plus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getErrorMessage } from "@/lib/utils/error"

import { useCreateSizeGuideMutation } from "../api/size-guides.api"
import type { SizeGuideFormValues } from "../schemas/size-guide.schema"
import { SizeGuideForm } from "./size-guide-form"

interface CreateSizeGuideDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateSizeGuideDialog({
  open,
  onOpenChange,
}: CreateSizeGuideDialogProps) {
  const [createSizeGuide, { isLoading }] =
    useCreateSizeGuideMutation()

  const handleSubmit = async (data: SizeGuideFormValues) => {
    try {
      await createSizeGuide({
        ...data,
        description: data.description || undefined,
      }).unwrap()

      toast.success("Size guide created successfully")
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to create size guide", {
        description:
          getErrorMessage(error) || "Something went wrong.",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" />
          Create
        </Button>
      </DialogTrigger>

      <DialogContent className="flex max-h-[85dvh] flex-col gap-4 overflow-hidden p-4 sm:p-6">
        <DialogHeader className="shrink-0">
          <DialogTitle>Create Size Guide</DialogTitle>
          <DialogDescription>
            Add a size guide and configure its measurements.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
          <SizeGuideForm
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            submitLabel="Create"
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}