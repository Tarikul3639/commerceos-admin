"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { PageContainer } from "@/components/layout/page-container"
import { UnauthorizedContent } from "@/features/permissions/components/unauthorized-content"
import { Permission } from "@/config/permissions.config"
import { getErrorMessage } from "@/lib/utils/error"
import { usePermission } from "@/hooks/use-permission"
import { useCreateBannerMutation } from "../../api/banners.api"
import type { BannerFormValues } from "../../schemas/banner.schema"
import { BannerForm } from "../shared/banner-form"

export function CreateBannerContent() {
  const router = useRouter()
  const permission = usePermission()
  const [createBanner, { isLoading }] = useCreateBannerMutation()

  const handleSubmit = async (values: BannerFormValues) => {
    try {
      const banner = await createBanner({
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
      router.push(`/dashboard/banners/${banner.id}`)
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to create banner")
    }
  }

  return (
    <PageContainer
      access={permission.has(Permission.BANNER_CREATE)}
      accessFallback={<UnauthorizedContent />}
      title="Create Banner"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Banners", href: "/dashboard/banners" },
        { label: "Create Banner" },
      ]}
    >
      <BannerForm
        onSubmit={handleSubmit}
        onCancel={() => router.push("/dashboard/banners")}
        submitLabel="Create Banner"
        isLoading={isLoading}
      />
    </PageContainer>
  )
}
