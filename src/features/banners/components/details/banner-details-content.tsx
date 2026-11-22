"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertCircle, Loader2, SquarePen, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"
import { PageContainer } from "@/components/layout/page-container"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Permission } from "@/config/permissions.config"
import { UnauthorizedContent } from "@/features/permissions/components/unauthorized-content"
import { usePermission } from "@/hooks/use-permission"
import { getErrorMessage } from "@/lib/utils/error"

import {
  useDeleteBannerMutation,
  useGetBannerQuery,
} from "../../api/banners.api"
import { BannerActivityCard } from "./banner-activity-card"
import { BannerInformationCard } from "./banner-information-card"
import { BannerPreview } from "./banner-preview"
import { BannerScheduleCard } from "./banner-schedule-card"
import { formatDate, formatEnumLabel } from "../../utils/banner-details.utils"

interface BannerDetailsContentProps {
  bannerId: string
}

/** Coordinates banner detail data, permission checks, and destructive actions. */
export function BannerDetailsContent({ bannerId }: BannerDetailsContentProps) {
  const router = useRouter()
  const permission = usePermission()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const canRead = permission.has(Permission.BANNER_READ)
  const canDelete = permission.has(Permission.BANNER_DELETE)
  const canUpdate = permission.has(Permission.BANNER_UPDATE)
  const {
    data: banner,
    isLoading,
    isError,
  } = useGetBannerQuery(bannerId, { skip: !canRead })
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation()

  /** Deletes the banner after permission validation and returns to the list. */
  const handleDelete = async () => {
    if (!canDelete || !banner) return

    try {
      await deleteBanner(banner.id).unwrap()
      toast.success("Banner deleted successfully")
      router.push("/dashboard/banners")
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to delete banner")
    }
  }

  return (
    <PageContainer
      access={canRead}
      accessFallback={<UnauthorizedContent />}
      title={banner?.title || "Banner details"}
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Banners", href: "/dashboard/banners" },
        { label: banner?.title || "Details" },
      ]}
      pageHeaderAction={
        <div className="flex items-center gap-2">
          {banner && canUpdate && (
            <Button size="sm" asChild>
              <Link href={`/dashboard/banners/${banner.id}/update`}>
                <SquarePen className="size-4" />
                Edit banner
              </Link>
            </Button>
          )}
          {banner && canDelete && (
            <Button
              size="sm"
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="size-4" />
              Delete
            </Button>
          )}
        </div>
      }
    >
      {isLoading ? (
        <div className="flex min-h-96 items-center justify-center">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : isError || !banner ? (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Unable to load banner</AlertTitle>
          <AlertDescription>
            Unable to load this banner. Please try again.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={banner.isActive ? "default" : "secondary"}>
                {banner.isActive ? "Active" : "Inactive"}
              </Badge>
              <Badge variant="outline">{formatEnumLabel(banner.type)}</Badge>
              <Badge variant="outline">{formatEnumLabel(banner.position)}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Last updated {formatDate(banner.updatedAt)}
            </p>
          </div>

          <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.85fr)]">
            <div className="min-w-0 space-y-5">
              <BannerPreview
                title={banner.title}
                imageUrl={banner.imageUrl}
                mobileImageUrl={banner.mobileImageUrl}
              />
              <BannerInformationCard banner={banner} />
            </div>

            <div className="min-w-0 space-y-5">
              <BannerScheduleCard startAt={banner.startAt} endAt={banner.endAt} />
              <BannerActivityCard banner={banner} />
            </div>
          </div>
        </div>
      )}

      {banner && canDelete && (
        <ConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete banner"
          description={
            <>
              Delete <strong>{banner.title || "this banner"}</strong>? Its desktop
              and mobile images will also be deleted.
            </>
          }
          confirmLabel={isDeleting ? "Deleting..." : "Delete"}
          onConfirm={handleDelete}
        />
      )}
    </PageContainer>
  )
}