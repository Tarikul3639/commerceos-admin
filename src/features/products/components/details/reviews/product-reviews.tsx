"use client"

import { Separator } from "@/components/ui/separator"
import type { ProductReview } from "../../../types/product.types"
import { ProductReviewItem } from "./product-review-item"
import { ProductReviewSummary } from "./product-review-summary"

interface ProductReviewsProps {
  reviews: ProductReview[]
  average: number
  count: number
}

export function ProductReviews({
  reviews,
  average,
  count,
}: ProductReviewsProps) {
  return (
    <div>
      <ProductReviewSummary reviews={reviews} average={average} count={count} />

      <Separator />

      {reviews.length > 0 ? (
        <div className="divide-y">
          {reviews.map((review) => (
            <ProductReviewItem key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-xs text-muted-foreground md:p-6">
          No reviews yet.
        </div>
      )}
    </div>
  )
}
