"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import type { CarouselApi } from "@/components/ui/carousel"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import type { ProductImageResponseDto } from "../../types/product.types"
import { ChevronLeft, ChevronRight } from "lucide-react"

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
      <Carousel
        setApi={setMainApi}
        opts={{ loop: false }}
        className="w-full min-w-0"
      >
        <div className="relative w-full overflow-hidden">
          <CarouselContent>
            {images.map((image) => (
              <CarouselItem key={image.id} className="min-w-0 basis-full">
                <div className="relative aspect-square w-full overflow-hidden rounded-xl border bg-muted">
                  <Image
                    src={image.imageUrl}
                    alt={name}
                    fill
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {images.length > 1 && (
            <div className="absolute right-3 bottom-3 z-10 flex items-center overflow-hidden rounded-lg bg-black/50 text-white">
              <button
                type="button"
                onClick={() => mainApi?.scrollPrev()}
                disabled={!mainApi?.canScrollPrev()}
                className="flex h-7 w-6 items-center justify-center transition-colors hover:bg-white/20 disabled:opacity-50"
              >
                <ChevronLeft className="size-3.5" />
              </button>

              <span className="px-2 text-[11px] leading-none font-medium">
                {activeIndex + 1} / {images.length}
              </span>

              <button
                type="button"
                onClick={() => mainApi?.scrollNext()}
                disabled={!mainApi?.canScrollNext()}
                className="flex h-7 w-6 items-center justify-center transition-colors hover:bg-white/10 disabled:opacity-50"
              >
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          )}
        </div>
      </Carousel>

      {images.length > 1 && (
        <Carousel
          setApi={setThumbnailApi}
          opts={{
            align: "start",
            dragFree: true,
          }}
          className="mx-auto w-full max-w-md"
        >
          <CarouselContent className="ml-1">
            {images.map((image, index) => {
              const isActive = index === activeIndex

              return (
                <CarouselItem key={image.id} className="basis-auto pl-1">
                  <button
                    type="button"
                    onClick={() => mainApi?.scrollTo(index)}
                    className={`relative size-14 overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                      isActive ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={image.imageUrl}
                      alt={`${name} ${index + 1}`}
                      fill
                      sizes="64px"
                      className={`object-cover transition-all duration-300 ${
                        !isActive && "brightness-50"
                      }`}
                    />
                  </button>
                </CarouselItem>
              )
            })}
          </CarouselContent>
        </Carousel>
      )}
    </div>
  )
}
