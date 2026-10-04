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
import { useUpdateBannerMutation } from "../api/banners.api"
import type { Banner } from "../types/banners.types"
import type { BannerFormValues } from "../schemas/banner.schema"
import { BannerForm } from "./banner-form"

interface UpdateBannerDialogProps {
  banner: Banner | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateBannerDialog({
  banner,
  open,
  onOpenChange,
}: UpdateBannerDialogProps) {
  const [updateBanner, { isLoading }] = useUpdateBannerMutation()

  const handleSubmit = async (values: BannerFormValues) => {
    if (!banner) return

    try {
      await updateBanner({
        id: banner.id,
        data: {
          title: values.title || null,
          imageUrl: values.imageUrl,
          imagePublicId: values.imagePublicId,
          mobileImageUrl: values.mobileImageUrl || null,
          mobileImagePublicId: values.mobileImagePublicId || null,
          type: values.type,
          position: values.position,
          link: values.link.trim() || null,
          buttonText: values.buttonText.trim() || null,
          openInNewTab: values.openInNewTab,
          sortOrder: Number(values.sortOrder),
          isActive: values.isActive,
          startAt: values.startAt
            ? new Date(values.startAt).toISOString()
            : null,
          endAt: values.endAt ? new Date(values.endAt).toISOString() : null,
        },
      }).unwrap()
      toast.success("Banner updated successfully")
      onOpenChange(false)
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to update banner")
    }
  }

  if (!banner) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Update banner</DialogTitle>
          <DialogDescription>Update banner display details.</DialogDescription>
        </DialogHeader>
        <BannerForm
          key={banner.id}
          banner={banner}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          submitLabel="Update banner"
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
