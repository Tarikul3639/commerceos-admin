"use client"

import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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

export function UpdateSizeGuideDialog({ sizeGuide, open, onOpenChange }: UpdateSizeGuideDialogProps) {
  const [updateSizeGuide, { isLoading }] = useUpdateSizeGuideMutation()
  if (!sizeGuide) return null

  const handleSubmit = async (data: SizeGuideFormValues) => {
    try {
      await updateSizeGuide({ id: sizeGuide.id, data: { ...data, description: data.description || undefined } }).unwrap()
      toast.success("Size guide updated successfully")
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to update size guide", { description: getErrorMessage(error) || "Something went wrong." })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader><DialogTitle>Update Size Guide</DialogTitle></DialogHeader>
        <SizeGuideForm sizeGuide={sizeGuide} onSubmit={handleSubmit} onCancel={() => onOpenChange(false)} submitLabel="Update" isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  )
}
