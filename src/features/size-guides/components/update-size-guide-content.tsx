"use client"

import { AlertCircle, Loader2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PageContainer } from "@/components/layout/page-container"
import { Permission } from "@/config/permissions.config"
import { UnauthorizedContent } from "@/features/permissions/components/unauthorized-content"
import { usePermission } from "@/hooks/use-permission"
import { getErrorMessage } from "@/lib/utils/error"

import {
  useGetSizeGuideQuery,
  useUpdateSizeGuideMutation,
} from "../api/size-guides.api"
import type { SizeGuideFormValues } from "../schemas/size-guide.schema"
import { SizeGuideForm } from "./size-guide-form"

/** Provides the update workflow for a size guide as a dedicated page. */
export function UpdateSizeGuideContent() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const permission = usePermission()
  const canRead = permission.has(Permission.PRODUCT_READ)
  const canUpdate = permission.has(Permission.PRODUCT_UPDATE)
  const {
    data: sizeGuide,
    isLoading,
    isError,
  } = useGetSizeGuideQuery(id, { skip: !canRead || !canUpdate })
  const [updateSizeGuide, { isLoading: isUpdating }] =
    useUpdateSizeGuideMutation()

  /** Saves the edited size guide and returns to the list on success. */
  const handleSubmit = async (data: SizeGuideFormValues) => {
    if (!canUpdate || !sizeGuide) return

    try {
      await updateSizeGuide({
        id: sizeGuide.id,
        data: {
          ...data,
          description: data.description || undefined,
        },
      }).unwrap()

      toast.success("Size guide updated successfully")
      router.push("/dashboard/size-guides")
    } catch (error) {
      toast.error("Failed to update size guide", {
        description: getErrorMessage(error) || "Something went wrong.",
      })
    }
  }

  return (
    <PageContainer
      access={canUpdate && canRead}
      accessFallback={<UnauthorizedContent />}
      title="Update Size Guide"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Size Guides", href: "/dashboard/size-guides" },
        { label: "Update" },
      ]}
    >
      <div className="mx-auto w-full max-w-5xl space-y-6">
        {isLoading ? (
          <div className="flex min-h-80 items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : isError || !sizeGuide ? (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertTitle>Unable to load size guide</AlertTitle>
            <AlertDescription>
              The size guide could not be loaded. Return to the list and try
              again.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="rounded-xl border bg-card p-5 sm:p-6">
              <p className="text-sm font-medium text-primary">
                PRODUCT CATALOG
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">
                Update size guide
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Update the guide information or adjust its measurement chart.
                Changes will be reflected wherever this guide is used.
              </p>
            </div>
            <SizeGuideForm
              key={sizeGuide.id}
              sizeGuide={sizeGuide}
              onSubmit={handleSubmit}
              onCancel={() => router.push("/dashboard/size-guides")}
              isLoading={isUpdating}
            />
          </>
        )}
      </div>
    </PageContainer>
  )
}
