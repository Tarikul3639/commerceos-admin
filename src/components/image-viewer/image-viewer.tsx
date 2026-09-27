"use client"

import { ChevronLeft, ChevronRight, RotateCcw, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

const demoImages = [
  {
    src: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    alt: "Smartphone",
  },
  {
    src: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
    alt: "Laptop",
  },
  {
    src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    alt: "Headphones",
  },
  {
    src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    alt: "Smart watch",
  },
]

export interface ImageViewerItem {
  src: string
  alt?: string
}

interface ImageViewerProps {
  images: ImageViewerItem[]
  open: boolean
  onOpenChange: (open: boolean) => void
  initialIndex?: number
}

export function ImageViewer({
  images,
  open,
  onOpenChange,
  initialIndex = 0,
}: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  const [zoom, setZoom] = useState(1)

  const [origin, setOrigin] = useState({
    x: 0,
    y: 0,
  })

  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  })

  const [isDragging, setIsDragging] = useState(false)

  const [dragStart, setDragStart] = useState({
    x: 0,
    y: 0,
  })

  const imageRef = useRef<HTMLImageElement>(null)

  const hasMultipleImages = images.length > 1
  const currentImage = images[currentIndex]

  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex)
      setZoom(1)
      setPosition({
        x: 0,
        y: 0,
      })
      setOrigin({
        x: 0,
        y: 0,
      })
    }
  }, [open, initialIndex])

  useEffect(() => {
    if (!open) {
      return
    }

    window.history.pushState({ imageViewer: true }, "")

    const handlePopState = () => {
      onOpenChange(false)
    }

    window.addEventListener("popstate", handlePopState)

    return () => {
      window.removeEventListener("popstate", handlePopState)

      if (window.history.state?.imageViewer) {
        window.history.back()
      }
    }
  }, [open, onOpenChange])

  useEffect(() => {
    if (!open || !hasMultipleImages) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
      }

      if (event.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
      }

      if (event.key === "Escape") {
        onOpenChange(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, hasMultipleImages, images.length, onOpenChange])

  if (!currentImage) {
    return null
  }

  /**
   * Reset zoom and image position.
   */
  const handleReset = () => {
    setZoom(1)

    setPosition({
      x: 0,
      y: 0,
    })
    setOrigin({
      x: 0,
      y: 0,
    })
  }

  /**
   * Zoom around the point directly under the cursor. The image's bounding box
   * is already scaled, so convert the cursor position back to image-space
   * before using it as the transform origin.
   */
  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const image = imageRef.current

    if (!image) {
      return
    }

    const imageRect = image.getBoundingClientRect()
    const cursorPoint = {
      x: (event.clientX - imageRect.left) / zoom,
      y: (event.clientY - imageRect.top) / zoom,
    }
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1
    const nextZoom = Math.min(Math.max(zoom * zoomFactor, 1), 100)

    if (nextZoom === zoom) {
      return
    }

    if (nextZoom === 1) {
      handleReset()
      return
    }

    // Changing transform-origin at an existing zoom would otherwise make
    // the image jump. Offset the translate value so the cursor point stays
    // fixed while the new scale is applied.
    setPosition((previousPosition) => ({
      x:
        previousPosition.x +
        zoom * (cursorPoint.x - origin.x) +
        origin.x -
        cursorPoint.x,
      y:
        previousPosition.y +
        zoom * (cursorPoint.y - origin.y) +
        origin.y -
        cursorPoint.y,
    }))
    setOrigin(cursorPoint)
    setZoom(nextZoom)
  }

  /**
   * Start dragging when image is zoomed.
   */
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (zoom <= 1) {
      return
    }

    setIsDragging(true)

    setDragStart({
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    })
  }

  /**
   * Move the image while dragging.
   */
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) {
      return
    }

    setPosition({
      x: event.clientX - dragStart.x,
      y: event.clientY - dragStart.y,
    })
  }

  /**
   * Stop dragging.
   */
  const handleMouseUp = () => {
    setIsDragging(false)
  }

  /**
   * Change image and reset zoom.
   */
  const handleImageChange = (index: number) => {
    setCurrentIndex(index)

    handleReset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="h-screen! w-screen! max-w-none! overflow-hidden border-0 p-0 shadow-none sm:h-auto! sm:max-h-[90vh] sm:max-w-5xl!"
      >
        {/* Header */}
        <DialogHeader className="absolute top-0 right-0 left-0 z-50 flex-row items-center justify-between bg-accent/10 px-4 py-3">
          <span className="text-sm font-medium text-white">
            {currentImage.alt}
          </span>

          <div className="flex items-center gap-2">
            {hasMultipleImages && (
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white">
                {currentIndex + 1} / {images.length}
              </span>
            )}
            {zoom > 1 && (
              <button
                type="button"
                onClick={handleReset}
                className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Reset zoom"
              >
                <RotateCcw className="size-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Close image viewer"
            >
              <X className="size-4" />
            </button>
          </div>
        </DialogHeader>

        {/* Main Image Container */}
        <div
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={cn(
            "flex h-screen w-full items-center justify-center overflow-hidden p-6 pt-16 pb-24 sm:h-[80vh]",
            zoom > 1 && "cursor-grab",
            isDragging && "cursor-grabbing"
          )}
        >
          <img
            ref={imageRef}
            src={currentImage.src}
            alt={currentImage.alt ?? ""}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              transformOrigin: `${origin.x}px ${origin.y}px`,
            }}
            className="max-h-full max-w-full object-contain select-none"
            draggable={false}
          />
        </div>

        {/* Previous */}
        {hasMultipleImages && (
          <button
            type="button"
            onClick={() =>
              handleImageChange(
                currentIndex === 0 ? images.length - 1 : currentIndex - 1
              )
            }
            className="absolute top-1/2 left-4 z-50 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Previous image"
          >
            <ChevronLeft className="size-6" />
          </button>
        )}

        {/* Next */}
        {hasMultipleImages && (
          <button
            type="button"
            onClick={() =>
              handleImageChange(
                currentIndex === images.length - 1 ? 0 : currentIndex + 1
              )
            }
            className="absolute top-1/2 right-4 z-50 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Next image"
          >
            <ChevronRight className="size-6" />
          </button>
        )}

        {/* Thumbnails */}
        {hasMultipleImages && (
          <div className="absolute bottom-4 left-1/2 z-50 flex max-w-[90%] -translate-x-1/2 gap-2 overflow-x-auto rounded-lg bg-black/50 p-2">
            {images.map((image, index) => (
              <button
                key={`${image.src}-${index}`}
                type="button"
                onClick={() => handleImageChange(index)}
                className={cn(
                  "size-14 shrink-0 overflow-hidden rounded-md border-2 transition",
                  index === currentIndex
                    ? "border-white"
                    : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <img
                  src={image.src}
                  alt={image.alt ?? ""}
                  className="size-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
