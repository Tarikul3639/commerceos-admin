"use client"

import { AlertCircle, Loader2 } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PageContainer } from "@/components/layout/page-container"
import { Permission } from "@/config/permissions.config"
import { UnauthorizedContent } from "@/features/permissions/components/unauthorized-content"
import { usePermission } from "@/hooks/use-permission"
import { getErrorMessage } from "@/lib/utils/error"
import {
  useGetBannerQuery,
  useUpdateBannerMutation,
} from "../../api/banners.api"
import type { BannerFormValues } from "../../schemas/banner.schema"
import { BannerForm } from "../shared/banner-form"

export function UpdateBannerContent() {
  const { id: bannerId } = useParams<{ id: string }>()
  const router = useRouter()
  const permission = usePermission()
  const { data: banner, isLoading, isError } = useGetBannerQuery(bannerId)
  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation()

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
      router.push(`/dashboard/banners/${banner.id}`)
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to update banner")
    }
  }

  return (
    <PageContainer
      access={permission.has(Permission.BANNER_UPDATE)}
      accessFallback={<UnauthorizedContent />}
      title="Update Banner"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Banners", href: "/dashboard/banners" },
        { label: "Update" },
      ]}
    >
      {isLoading ? (
        <div className="flex min-h-96 items-center justify-center">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : isError || !banner ? (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Unable to load banner</AlertTitle>
          <AlertDescription>Failed to load banner details.</AlertDescription>
        </Alert>
      ) : (
        <BannerForm
          key={banner.id}
          banner={banner}
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/dashboard/banners/${banner.id}`)}
          submitLabel="Update Banner"
          isLoading={isUpdating}
        />
      )}
    </PageContainer>
  )
}
