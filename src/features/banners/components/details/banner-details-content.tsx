"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertCircle,
  ExternalLink,
  Loader2,
  SquarePen,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"
import { Image as ImageIcon } from "lucide-react"

import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"
import { PageContainer } from "@/components/layout/page-container"
import { AppImage } from "@/components/media"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Permission } from "@/config/permissions.config"
import { UnauthorizedContent } from "@/features/permissions/components/unauthorized-content"
import { usePermission } from "@/hooks/use-permission"
import { getErrorMessage } from "@/lib/utils/error"

import {
  useDeleteBannerMutation,
  useGetBannerQuery,
} from "../../api/banners.api"

interface BannerDetailsContentProps {
  bannerId: string
}

export function BannerDetailsContent({ bannerId }: BannerDetailsContentProps) {
  const router = useRouter()
  const permission = usePermission()

  const [deleteOpen, setDeleteOpen] = useState(false)

  const { data: banner, isLoading, isError } = useGetBannerQuery(bannerId)
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation()

  const handleDelete = async () => {
    if (!banner) return

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
      access={permission.has(Permission.BANNER_READ)}
      accessFallback={<UnauthorizedContent />}
      title={banner?.title || "Banner details"}
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Banners", href: "/dashboard/banners" },
        { label: "Banner details" },
      ]}
      pageHeaderAction={
        <>
          {banner && permission.has(Permission.BANNER_UPDATE) && (
            <Button size="sm" asChild>
              <Link href={`/dashboard/banners/${banner.id}/update`}>
                <SquarePen />
                Update
              </Link>
            </Button>
          )}

          {banner && permission.has(Permission.BANNER_DELETE) && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 />
              Delete
            </Button>
          )}
        </>
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
          <AlertDescription>Failed to load banner details.</AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Banner preview</CardTitle>
              <CardDescription>
                Preview of the banner images as they will appear on the
                storefront.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid space-y-6 gap-x-8 gap-y-6 md:grid-cols-2">
              <Preview
                label="Desktop banner"
                image={banner.imageUrl}
                title={banner.title}
                aspect="desktop"
              />

              {banner.mobileImageUrl && (
                <Preview
                  label="Mobile banner"
                  image={banner.mobileImageUrl}
                  title={banner.title}
                  aspect="mobile"
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Banner information</CardTitle>
            </CardHeader>

            <CardContent className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="grid grid-cols-2 gap-5 lg:contents">
                <Detail label="Title" value={banner.title || "—"} />
                <Detail label="Type" value={formatEnumLabel(banner.type)} />
              </div>

              <div className="grid grid-cols-2 gap-5 lg:contents">
                <Detail
                  label="Position"
                  value={formatEnumLabel(banner.position)}
                />

                <div className="space-y-1">
                  <p className="text-sm font-medium">Status</p>
                  <Badge variant={banner.isActive ? "default" : "secondary"}>
                    {banner.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5 lg:contents">
                <Detail label="Link" value={banner.link || "—"} />
                <Detail label="Button text" value={banner.buttonText || "—"} />
              </div>

              <div className="grid grid-cols-2 gap-5 lg:contents">
                <Detail
                  label="Open in new tab"
                  value={banner.openInNewTab ? "Yes" : "No"}
                />
                <Detail label="Sort order" value={String(banner.sortOrder)} />
              </div>

              <Detail label="Start date" value={formatDate(banner.startAt)} />
              <Detail label="End date" value={formatDate(banner.endAt)} />

              <div className="grid grid-cols-2 gap-5 lg:contents">
                <Detail
                  label="Created by"
                  value={banner.createdBy?.name || "—"}
                />
                <Detail
                  label="Updated by"
                  value={banner.updatedBy?.name || "—"}
                />
              </div>

              <Detail label="Created at" value={formatDate(banner.createdAt)} />
              <Detail label="Updated at" value={formatDate(banner.updatedAt)} />
            </CardContent>
          </Card>
        </div>
      )}

      {banner && (
        <ConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete banner"
          description={
            <>
              Delete <strong>{banner.title || "this banner"}</strong>? Its
              Cloudinary images will also be deleted.
            </>
          }
          confirmLabel={isDeleting ? "Deleting..." : "Delete"}
          onConfirm={handleDelete}
        />
      )}
    </PageContainer>
  )
}

function Preview({
  label,
  title,
  image,
  aspect,
}: {
  label: string
  title: string | null
  image: string | null
  aspect: "desktop" | "mobile"
}) {
  const aspectClass = aspect === "desktop" ? "aspect-[3/1]" : "aspect-[2/1]"

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{label}</p>

        {image && (
          <Button asChild variant="ghost" size="sm" className="h-8">
            <a href={image} target="_blank" rel="noreferrer">
              <ExternalLink />
              View
            </a>
          </Button>
        )}
      </div>

      {image ? (
        <div
          className={`relative overflow-hidden rounded-lg border bg-muted ${aspectClass}`}
        >
          <AppImage
            name={title || label}
            image={image}
            clickable
            className="h-full w-full rounded-md object-cover after:inset-0 after:rounded-md"
          />
        </div>
      ) : (
        <div
          className={`flex ${aspectClass} items-center justify-center rounded-lg border bg-muted/30 text-sm text-muted-foreground`}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <ImageIcon className="size-6 text-muted-foreground" />
            </div>

            <p>No {label.toLowerCase()} image</p>
          </div>
        </div>
      )}
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 space-y-1">
      <p className="text-sm font-medium">{label}</p>

      <p className="text-sm wrap-break-word text-muted-foreground">{value}</p>
    </div>
  )
}

function formatDate(value: string | null) {
  return value
    ? new Date(value).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour12: true,
      hour: "numeric",
      minute: "numeric",
    })
    : "—"
}

function formatEnumLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ")
}
