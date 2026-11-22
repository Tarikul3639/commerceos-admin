"use client"

import Image from "next/image"
import { ExternalLink, Image as ImageIcon, Monitor, Smartphone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface BannerPreviewProps {
  title: string | null
  imageUrl: string
  mobileImageUrl: string | null
}

/** Shows the desktop and mobile creative independently for quick review. */
export function BannerPreview({
  title,
  imageUrl,
  mobileImageUrl,
}: BannerPreviewProps) {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <div className="border-b px-5 py-4">
        <h2 className="text-sm font-semibold">Banner preview</h2>
        <p className="text-xs text-muted-foreground">
          Responsive creative used by desktop and phone visitors.
        </p>
      </div>

      <div className="grid gap-5 p-4 sm:p-5">
        <PreviewItem
          label="Desktop image"
          imageUrl={imageUrl}
          title={title}
          icon={<Monitor className="size-4" />}
          aspectClass="aspect-16/11 sm:aspect-2/1 lg:aspect-32/9"
        />
        <PreviewItem
          label="Mobile image"
          imageUrl={mobileImageUrl || imageUrl}
          title={title}
          icon={<Smartphone className="size-4" />}
          aspectClass="aspect-16/11"
          fallback={!mobileImageUrl}
        />
      </div>
    </Card>
  )
}

/** Renders one responsive image preview and its original-image link. */
function PreviewItem({
  label,
  imageUrl,
  title,
  icon,
  aspectClass,
  fallback = false,
}: {
  label: string
  imageUrl: string
  title: string | null
  icon: React.ReactNode
  aspectClass: string
  fallback?: boolean
}) {
  return (
    <div className="min-w-0 space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium">
        <span className="text-muted-foreground">{icon}</span>
        {label}
        {fallback && (
          <span className="text-xs font-normal text-muted-foreground">
            Uses desktop fallback
          </span>
        )}
      </div>
      {imageUrl ? (
        <div className={`relative overflow-hidden rounded-lg border bg-muted ${aspectClass}`}>
          <Image
            src={imageUrl}
            alt={`${title || "Banner"} ${label.toLowerCase()} preview`}
            fill
            unoptimized
            priority
            className="object-cover"
          />
          <Button
            asChild
            size="icon"
            variant="secondary"
            className="absolute right-2 bottom-2 size-8"
            aria-label={`Open ${label.toLowerCase()}`}
          >
            <a href={imageUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="size-4" />
            </a>
          </Button>
        </div>
      ) : (
        <div className={`flex items-center justify-center rounded-lg border border-dashed bg-muted/30 text-sm text-muted-foreground ${aspectClass}`}>
          <ImageIcon className="mr-2 size-5" />
          No image uploaded
        </div>
      )}
    </div>
  )
}