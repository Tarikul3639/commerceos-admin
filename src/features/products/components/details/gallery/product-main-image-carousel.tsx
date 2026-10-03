"use client"

import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import type { ProductImageResponseDto } from "../../../types/product.types"

interface ProductMainImageCarouselProps {
  name: string
  images: ProductImageResponseDto[]
  activeIndex: number
  api?: CarouselApi
  onApiChange: (api: CarouselApi) => void
}

export function ProductMainImageCarousel({
  name,
  images,
  activeIndex,
  api,
  onApiChange,
}: ProductMainImageCarouselProps) {
  return (
    <Carousel
      setApi={onApiChange}
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
              onClick={() => api?.scrollPrev()}
              disabled={!api?.canScrollPrev()}
              className="flex h-7 w-6 items-center justify-center transition-colors hover:bg-white/20 disabled:opacity-50"
            >
              <ChevronLeft className="size-3.5" />
            </button>

            <span className="px-2 text-[11px] leading-none font-medium">
              {activeIndex + 1} / {images.length}
            </span>

            <button
              type="button"
              onClick={() => api?.scrollNext()}
              disabled={!api?.canScrollNext()}
              className="flex h-7 w-6 items-center justify-center transition-colors hover:bg-white/10 disabled:opacity-50"
            >
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        )}
      </div>
    </Carousel>
  )
}
