"use client"

import { AppImage } from "@/components/media"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import type { Banner } from "../types/banners.types"

interface BannerDetailsDialogProps {
  banner: Banner
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BannerDetailsDialog({
  banner,
  open,
  onOpenChange,
}: BannerDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Banner details</DialogTitle>
          <DialogDescription>
            Review banner configuration and audit details.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[70vh] space-y-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Desktop image</p>
              <AppImage
                name={banner.title ?? "Banner"}
                image={banner.imageUrl}
                clickable
                className="h-28 w-full rounded-md"
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Mobile image</p>
              {banner.mobileImageUrl ? (
                <AppImage
                  name={banner.title ?? "Banner"}
                  image={banner.mobileImageUrl}
                  clickable
                  className="h-28 w-full rounded-md"
                />
              ) : (
                <div className="flex h-28 items-center justify-center rounded-md border bg-muted text-xs text-muted-foreground">
                  No mobile image
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">Title</p>
            <p className="text-sm text-muted-foreground">
              {banner.title || "—"}
            </p>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <Detail label="Type" value={formatEnumLabel(banner.type)} />
            <Detail label="Position" value={formatEnumLabel(banner.position)} />
            <Detail label="Sort order" value={String(banner.sortOrder)} />
            <div className="space-y-1">
              <p className="text-sm font-medium">Status</p>
              <Badge variant={banner.isActive ? "default" : "secondary"}>
                {banner.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <Detail label="Link" value={banner.link || "—"} />
            <Detail label="Button text" value={banner.buttonText || "—"} />
            <Detail
              label="Opens in new tab"
              value={banner.openInNewTab ? "Yes" : "No"}
            />
            <Detail label="Starts" value={formatDate(banner.startAt)} />
            <Detail label="Ends" value={formatDate(banner.endAt)} />
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <Detail label="Created by" value={banner.createdBy?.name ?? "—"} />
            <Detail label="Created" value={formatDate(banner.createdAt)} />
            <Detail label="Updated by" value={banner.updatedBy?.name ?? "—"} />
            <Detail label="Updated" value={formatDate(banner.updatedAt)} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 space-y-1">
      <p className="text-sm font-medium">{label}</p>
      <p className="truncate text-sm text-muted-foreground">{value}</p>
    </div>
  )
}

function formatDate(value: string | null) {
  if (!value) return "—"
  return new Date(value).toLocaleString()
}

function formatEnumLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ")
}
