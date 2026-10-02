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
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

import { useCreateBrandMutation } from "../api/brands.api"
import type { BrandFormValues } from "../schemas/brand.schema"
import { BrandForm } from "./brand-form"

interface CreateBrandDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateBrandDialog({
  open,
  onOpenChange,
}: CreateBrandDialogProps) {
  const [createBrand, { isLoading }] = useCreateBrandMutation()

  const handleSubmit = async (data: BrandFormValues) => {
    try {
      await createBrand({
        name: data.name,
        slug: data.slug,
        description: data.description || undefined,
        image: data.image || undefined,
        publicId: data.publicId || undefined,
        isActive: data.isActive,
      }).unwrap()

      toast.success("Brand created successfully")

      onOpenChange(false)
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Failed to create brand")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="default">
                <Plus className="h-4 w-4" />
                Create
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create a new brand</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Brand</DialogTitle>
          <DialogDescription>
            Add a new brand to your catalog.
          </DialogDescription>
        </DialogHeader>

        <BrandForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          submitLabel="Create Brand"
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
