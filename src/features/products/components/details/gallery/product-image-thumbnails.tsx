"use client"

import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import type { ProductImageResponseDto } from "../../../types/product.types"

interface ProductImageThumbnailsProps {
  name: string
  images: ProductImageResponseDto[]
  activeIndex: number
  api?: CarouselApi
  onApiChange: (api: CarouselApi) => void
}

export function ProductImageThumbnails({
  name,
  images,
  activeIndex,
  api,
  onApiChange,
}: ProductImageThumbnailsProps) {
  return (
    <Carousel
      setApi={onApiChange}
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
                onClick={() => api?.scrollTo(index)}
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
  )
}
