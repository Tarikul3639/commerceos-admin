"use client"

import { Image as ImageIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useImageViewer } from "@/components/image-viewer"
import { cn } from "@/lib/utils"

interface AppImageProps {
  name?: string | null
  image?: string | null
  images?: string[]
  clickable?: boolean
  className?: string
}

export function AppImage({
  name,
  image,
  images = [],
  clickable = true,
  className,
}: AppImageProps) {
  const { open } = useImageViewer()

  const viewerImages = images.length ? images : image ? [image] : []

  const handleImageClick = () => {
    if (!clickable || !viewerImages.length) {
      return
    }

    open(
      viewerImages.map((src) => ({
        src,
        alt: name ?? "Image",
      }))
    )
  }

  const initials = name
    ?.trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <Avatar
      className={cn(
        "shrink-0 overflow-hidden",
        clickable && viewerImages.length > 0 && "cursor-pointer",
        className
      )}
      onClick={handleImageClick}
    >
      {image && (
        <AvatarImage
          src={image}
          alt={name ?? "Image"}
          className="size-full rounded-none object-cover"
        />
      )}

      <AvatarFallback className="rounded-none text-[length:inherit] text-inherit">
        {initials || <ImageIcon className="size-[1em] text-muted-foreground" />}
      </AvatarFallback>
    </Avatar>
  )
}
