"use client"

import { Image as ImageIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useImageViewer } from "@/components/image-viewer"
import { cn } from "@/lib/utils"

interface AppImageProps {
  name?: string | null
  image?: string | null
  clickable?: boolean
  className?: string
}

export function AppImage({
  name,
  image,
  clickable = true,
  className,
}: AppImageProps) {
  const { open } = useImageViewer()

  const initials = name
    ?.trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const handleImageClick = () => {
    if (!clickable || !image) {
      return
    }

    open([
      {
        src: image,
        alt: name ?? "Image",
      },
    ])
  }

  return (
    <Avatar
      className={cn(
        "shrink-0 overflow-hidden",
        clickable && image && "cursor-pointer",
        className
      )}
      onClick={handleImageClick}
    >
      {image && (
        <AvatarImage
          src={image}
          alt={name ?? "Image"}
          className="size-full object-cover"
        />
      )}

      <AvatarFallback className="text-[length:inherit] text-inherit">
        {initials || <ImageIcon className="size-[1em] text-muted-foreground" />}
      </AvatarFallback>
    </Avatar>
  )
}
