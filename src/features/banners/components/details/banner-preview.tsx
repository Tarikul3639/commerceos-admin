"use client"

import Image from "next/image"
import { useState } from "react"
import {
  ExternalLink,
  Image as ImageIcon,
  Images,
  MonitorSmartphone,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

import type { BannerImage } from "../../types/banners.types"

interface BannerPreviewProps {
  title: string | null
  images: BannerImage[]
}

/** Displays the responsive banner image and its selectable thumbnail gallery. */
export function BannerPreview({ title, images }: BannerPreviewProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const selectedImage = images[selectedImageIndex] ?? images[0]

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <div className="space-y-0.5">
          <h2 className="text-sm font-semibold">Banner preview</h2>
          <p className="text-xs text-muted-foreground">
            {images.length} {images.length === 1 ? "image" : "images"} ·
            Responsive on desktop and mobile
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MonitorSmartphone className="size-4" />
          <span>3:1 aspect ratio</span>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        {selectedImage ? (
          <>
            <div className="relative aspect-3/1 overflow-hidden rounded-lg border bg-muted">
              <Image
                src={selectedImage.imageUrl}
                alt={`${title || "Banner"} preview ${selectedImageIndex + 1}`}
                fill
                unoptimized
                priority
                className="object-cover"
              />
              <div className="absolute bottom-2 left-2 rounded-md bg-black/65 px-2.5 py-1 text-xs font-medium text-white">
                Image {selectedImageIndex + 1} of {images.length}
              </div>
              <Button
                asChild
                size="icon"
                variant="secondary"
                className="absolute right-2 bottom-2 size-8"
                aria-label="Open original image"
              >
                <a
                  href={selectedImage.imageUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink className="size-4" />
                </a>
              </Button>
            </div>

            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6">
                {images.map((image, index) => (
                  <button
                    key={image.id ?? image.publicId}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    aria-label={`Preview image ${index + 1}`}
                    aria-pressed={selectedImageIndex === index}
                    className={`group relative aspect-2/1 overflow-hidden rounded-md border bg-muted transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
                      selectedImageIndex === index
                        ? "border-primary ring-2 ring-primary/25"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Image
                      src={image.imageUrl}
                      alt=""
                      fill
                      unoptimized
                      className="object-cover transition group-hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex aspect-3/1 items-center justify-center rounded-lg border border-dashed bg-muted/30 text-sm text-muted-foreground">
            <ImageIcon className="mr-2 size-5" />
            <Images className="sr-only" />
            No banner images uploaded
          </div>
        )}
      </div>
    </Card>
  )
}
