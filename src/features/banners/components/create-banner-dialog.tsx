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
import { useCreateBannerMutation } from "../api/banners.api"
import type { BannerFormValues } from "../schemas/banner.schema"
import { BannerForm } from "./banner-form"

interface CreateBannerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateBannerDialog({
  open,
  onOpenChange,
}: CreateBannerDialogProps) {
  const [createBanner, { isLoading }] = useCreateBannerMutation()

  const handleSubmit = async (values: BannerFormValues) => {
    try {
      await createBanner({
        title: values.title || undefined,
        imageUrl: values.imageUrl,
        imagePublicId: values.imagePublicId,
        mobileImageUrl: values.mobileImageUrl || undefined,
        mobileImagePublicId: values.mobileImagePublicId || undefined,
        type: values.type,
        position: values.position,
        link: values.link.trim() || undefined,
        buttonText: values.buttonText.trim() || undefined,
        openInNewTab: values.openInNewTab,
        sortOrder: Number(values.sortOrder),
        isActive: values.isActive,
        startAt: values.startAt
          ? new Date(values.startAt).toISOString()
          : undefined,
        endAt: values.endAt ? new Date(values.endAt).toISOString() : undefined,
      }).unwrap()
      toast.success("Banner created successfully")
      onOpenChange(false)
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to create banner")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Create
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create banner</DialogTitle>
          <DialogDescription>
            Add a banner and choose where it appears in the storefront.
          </DialogDescription>
        </DialogHeader>
        <BannerForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          submitLabel="Create banner"
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
