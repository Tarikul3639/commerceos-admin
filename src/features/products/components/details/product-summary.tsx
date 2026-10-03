"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Rating } from "@/components/shared/rating"
import { Collapsible } from "@/components/ui/collapsible"
import {
  ProductSizeGuideContent,
  ProductSizeGuideTrigger,
} from "./product-size-guide"
import { ProductActions } from "./product-actions"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Info } from "lucide-react"

import type { ProductDetails } from "../../types/product.types"
import { Minus, Plus } from "lucide-react"

interface ProductSummaryProps {
  product: ProductDetails
}

export function ProductSummary({ product }: ProductSummaryProps) {
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)

  const originalPrice = Number(product.sellingPrice)

  const now = Date.now()
  const candidateDiscount = product.discount
  const activeDiscount =
    candidateDiscount &&
      (!candidateDiscount.startDate ||
        new Date(candidateDiscount.startDate).getTime() <= now) &&
      (!candidateDiscount.endDate ||
        new Date(candidateDiscount.endDate).getTime() >= now)
      ? candidateDiscount
      : null

  const discountAmount = candidateDiscount
    ? originalPrice * (Number(candidateDiscount.value) / 100)
    : 0

  const discountedPrice = Math.max(originalPrice - discountAmount, 0)

  const sizeGuide = [
    {
      size: "S",
      chest: "36–38",
      length: "27",
      shoulder: "17",
      sleeve: "8",
    },
    {
      size: "M",
      chest: "38–40",
      length: "28",
      shoulder: "18",
      sleeve: "8.5",
    },
    {
      size: "L",
      chest: "40–42",
      length: "29",
      shoulder: "19",
      sleeve: "9",
    },
    {
      size: "XL",
      chest: "42–44",
      length: "30",
      shoulder: "20",
      sleeve: "9.5",
    },
    {
      size: "XXL",
      chest: "44–46",
      length: "31",
      shoulder: "21",
      sleeve: "10",
    },
  ]

  return (
    <div className="flex flex-col justify-center">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Badge variant={product.isActive ? "default" : "secondary"}>
            {product.isActive ? "Active" : "Inactive"}
          </Badge>

          {product.deletedAt && <Badge variant="destructive">Deleted</Badge>}
        </div>

        {product.stock > 0 ? (
          <span className="text-xs font-medium text-green-500 uppercase">
            In Stock: {product.stock}
          </span>
        ) : (
          <span className="text-xs font-medium text-destructive uppercase">
            Out of Stock
          </span>
        )}

        <h5 className="text-lg font-semibold tracking-tight">{product.name}</h5>

        <Rating
          value={product.rating.average}
          count={product.rating.count}
          size="md"
        />

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-2xl font-semibold tracking-tight">
              ৳{(activeDiscount ? discountedPrice : originalPrice).toFixed(2)}
            </p>

            {candidateDiscount && (
              <>
                <Badge variant="destructive">
                  {Number(candidateDiscount.value)}% OFF
                </Badge>

                <HoverCard>
                  <HoverCardTrigger asChild>
                    <button
                      type="button"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                      aria-label="View discount details"
                    >
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </HoverCardTrigger>

                  <HoverCardContent className="w-80">
                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold">Discount Details</p>
                        <p className="text-xs text-muted-foreground">
                          Current discount information
                        </p>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Regular price
                          </span>
                          <span>৳{originalPrice.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Discount
                          </span>
                          <span className="text-destructive">
                            {Number(candidateDiscount.value)}%
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Discounted price
                          </span>
                          <span className="font-medium">
                            ৳{discountedPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="border-t pt-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Status</span>

                          <Badge
                            variant={activeDiscount ? "default" : "secondary"}
                          >
                            {activeDiscount
                              ? "Active"
                              : candidateDiscount.startDate &&
                                new Date(
                                  candidateDiscount.startDate
                                ).getTime() > now
                                ? "Upcoming"
                                : "Expired"}
                          </Badge>
                        </div>

                        <div className="mt-2 space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Starts
                            </span>
                            <span>
                              {candidateDiscount.startDate
                                ? new Date(
                                  candidateDiscount.startDate
                                ).toLocaleDateString()
                                : "No start date"}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Ends</span>
                            <span>
                              {candidateDiscount.endDate
                                ? new Date(
                                  candidateDiscount.endDate
                                ).toLocaleDateString()
                                : "No end date"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            Cost: ৳{Number(product.purchasePrice).toFixed(2)}
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          {product.subDescription}
        </p>
      </div>

      <Separator className="my-6" />

      <div className="space-y-5">
        {product.colors && product.colors.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs uppercase">
              Select Color:{" "}
              <span className="text-primary">{selectedColor || "None"}</span>
            </Label>

            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => {
                const isSelected = selectedColor === color.name

                return (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedColor(color.name)}
                    aria-label={color.name}
                    className={`rounded-xs border p-0.5 transition-colors ${isSelected
                        ? "border-primary"
                        : "border-border hover:border-primary/50"
                      }`}
                  >
                    <span
                      className="block size-7 rounded-xs"
                      style={{
                        backgroundColor: color.hex,
                      }}
                    />
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {product.sizes.length > 0 && (
          <Collapsible
            open={isSizeGuideOpen}
            onOpenChange={setIsSizeGuideOpen}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <Label className="text-xs uppercase">
                Select Size:{" "}
                <span className="text-primary">{selectedSize || "None"}</span>
              </Label>

              <ProductSizeGuideTrigger open={isSizeGuideOpen} />
            </div>

            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => {
                const isSelected = selectedSize === size

                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-8 rounded-xs border px-2 py-1 text-sm transition-colors ${isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:bg-muted"
                      }`}
                  >
                    {size}
                  </button>
                )
              })}
            </div>

            <ProductSizeGuideContent
              sizes={sizeGuide}
              selectedSize={selectedSize}
            />
          </Collapsible>
        )}

        <div className="space-y-2">
          <Label className="text-xs uppercase">Quantity</Label>

          <div className="flex w-fit items-center rounded-sm border">
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              disabled={quantity <= 1}
              className="flex size-8 items-center justify-center text-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Minus className="size-4" />
            </button>

            <span className="flex h-8 min-w-9 items-center justify-center border-x text-sm font-medium">
              {quantity}
            </span>

            <button
              type="button"
              onClick={() =>
                setQuantity((value) => Math.min(product.stock, value + 1))
              }
              disabled={quantity >= product.stock}
              title={
                quantity >= product.stock ? "Max stock reached" : undefined
              }
              className="flex size-8 items-center justify-center text-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      <ProductActions
        disabled={product.stock <= 0}
        onAddToCart={() => { }}
        onBuyNow={() => { }}
        onCompare={() => { }}
        onFavorite={() => { }}
        onShare={() => { }}
      />
    </div>
  )
}
