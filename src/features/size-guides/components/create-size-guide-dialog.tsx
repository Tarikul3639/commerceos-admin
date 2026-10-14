"use client"

import { Plus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getErrorMessage } from "@/lib/utils/error"

import { useCreateSizeGuideMutation } from "../api/size-guides.api"
import type { SizeGuideFormValues } from "../schemas/size-guide.schema"
import { SizeGuideForm } from "./size-guide-form"

interface CreateSizeGuideDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateSizeGuideDialog({ open, onOpenChange }: CreateSizeGuideDialogProps) {
  const [createSizeGuide, { isLoading }] = useCreateSizeGuideMutation()

  const handleSubmit = async (data: SizeGuideFormValues) => {
    try {
      await createSizeGuide({ ...data, description: data.description || undefined }).unwrap()
      toast.success("Size guide created successfully")
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to create size guide", { description: getErrorMessage(error) || "Something went wrong." })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="size-4" /> Create</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader><DialogTitle>Create Size Guide</DialogTitle></DialogHeader>
        <SizeGuideForm onSubmit={handleSubmit} onCancel={() => onOpenChange(false)} submitLabel="Create" isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  )
}
