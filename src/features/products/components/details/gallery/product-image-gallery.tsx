"use client"

import { useEffect, useState } from "react"
import type { CarouselApi } from "@/components/ui/carousel"

import type { ProductImageResponseDto } from "../../../types/product.types"
import { ProductImageThumbnails } from "./product-image-thumbnails"
import { ProductMainImageCarousel } from "./product-main-image-carousel"

interface ProductImageGalleryProps {
  name: string
  images?: ProductImageResponseDto[]
}

export function ProductImageGallery({
  name,
  images = [],
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [mainApi, setMainApi] = useState<CarouselApi>()
  const [thumbnailApi, setThumbnailApi] = useState<CarouselApi>()

  useEffect(() => {
    if (!mainApi) return

    const onSelect = () => {
      setActiveIndex(mainApi.selectedScrollSnap())
    }

    onSelect()
    mainApi.on("select", onSelect)

    return () => {
      mainApi.off("select", onSelect)
    }
  }, [mainApi])

  useEffect(() => {
    if (!thumbnailApi) return

    if (activeIndex <= images.length / 2) {
      thumbnailApi.scrollTo(activeIndex - 2)
    } else {
      thumbnailApi.scrollTo(activeIndex + 2)
    }
  }, [thumbnailApi, activeIndex])

  if (!images.length) {
    return (
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl border bg-muted">
        <span className="text-sm text-muted-foreground">
          No image available
        </span>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      <ProductMainImageCarousel
        name={name}
        images={images}
        activeIndex={activeIndex}
        api={mainApi}
        onApiChange={setMainApi}
      />

      {images.length > 1 && (
        <ProductImageThumbnails
          name={name}
          images={images}
          activeIndex={activeIndex}
          api={mainApi}
          onApiChange={setThumbnailApi}
        />
      )}
    </div>
  )
}
