"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { PageContainer } from "@/components/layout/page-container"
import { Permission } from "@/config/permissions.config"
import { UnauthorizedContent } from "@/features/permissions/components/unauthorized-content"
import { usePermission } from "@/hooks/use-permission"
import { getErrorMessage } from "@/lib/utils/error"

import { useCreateSizeGuideMutation } from "../api/size-guides.api"
import type { SizeGuideFormValues } from "../schemas/size-guide.schema"
import { SizeGuideForm } from "./size-guide-form"

/** Provides the create workflow for a size guide as a dedicated page. */
export function CreateSizeGuideContent() {
  const router = useRouter()
  const canCreate = usePermission().has(Permission.PRODUCT_CREATE)
  const [createSizeGuide, { isLoading }] = useCreateSizeGuideMutation()

  /** Creates a size guide and returns to the size guide list on success. */
  const handleSubmit = async (data: SizeGuideFormValues) => {
    if (!canCreate) return

    try {
      await createSizeGuide({
        ...data,
        description: data.description || undefined,
      }).unwrap()

      toast.success("Size guide created successfully")
      router.push("/dashboard/size-guides")
    } catch (error) {
      toast.error("Failed to create size guide", {
        description: getErrorMessage(error) || "Something went wrong.",
      })
    }
  }

  return (
    <PageContainer
      access={canCreate}
      accessFallback={<UnauthorizedContent />}
      title="Create Size Guide"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Size Guides", href: "/dashboard/size-guides" },
        { label: "Create" },
      ]}
    >
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <div className="rounded-xl border bg-card p-5 sm:p-6">
          <p className="text-sm font-medium text-primary">PRODUCT CATALOG</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">
            Build a clear size chart
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            Add the guide details, choose a measurement unit, then define the
            sizes and measurements customers will use.
          </p>
        </div>
        <SizeGuideForm
          onSubmit={handleSubmit}
          onCancel={() => router.push("/dashboard/size-guides")}
          isLoading={isLoading}
        />
      </div>
    </PageContainer>
  )
}
