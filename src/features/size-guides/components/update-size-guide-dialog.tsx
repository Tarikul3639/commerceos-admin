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

import { useUpdateSizeGuideMutation } from "../api/size-guides.api"
import type { SizeGuideFormValues } from "../schemas/size-guide.schema"
import type { SizeGuide } from "../types/size-guide.types"
import { SizeGuideForm } from "./size-guide-form"

interface UpdateSizeGuideDialogProps {
  sizeGuide: SizeGuide | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateSizeGuideDialog({
  sizeGuide,
  open,
  onOpenChange,
}: UpdateSizeGuideDialogProps) {
  const [updateSizeGuide, { isLoading }] = useUpdateSizeGuideMutation()

  const handleSubmit = async (data: SizeGuideFormValues) => {
    if (!sizeGuide) return

    try {
      await updateSizeGuide({
        id: sizeGuide.id,
        data: {
          ...data,
          description: data.description || undefined,
        },
      }).unwrap()

      toast.success("Size guide updated successfully")
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to update size guide", {
        description: getErrorMessage(error) || "Something went wrong.",
      })
    }
  }

  if (!sizeGuide) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85dvh] flex-col gap-4 overflow-hidden p-4 sm:p-6">
        <DialogHeader className="shrink-0">
          <DialogTitle>Update Size Guide</DialogTitle>
          <DialogDescription>
            Update the size guide details and measurements.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
          <SizeGuideForm
            key={sizeGuide.id}
            sizeGuide={sizeGuide}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            submitLabel="Update"
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
