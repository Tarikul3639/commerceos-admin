import { Progress } from "@/components/ui/progress"
import { Rating } from "@/components/shared/rating"
import { WriteReviewDialog } from "./write-review-dialog"
import type { ProductReview } from "../../../types/product.types"

interface ProductReviewSummaryProps {
  reviews: ProductReview[]
  average: number
  count: number
}

export function ProductReviewSummary({
  reviews,
  average,
  count,
}: ProductReviewSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr_1fr]">
      <div className="flex flex-col items-center justify-center px-1 py-3 text-center md:border-b md:p-4">
        <p className="text-xs font-medium">Average rating</p>

        <p className="mt-2 text-4xl font-bold tracking-tight">
          {average.toFixed(1)}
          <span className="text-xl text-muted-foreground">/5</span>
        </p>

        <div className="mt-2">
          <Rating value={average} size="md" />
        </div>

        <p className="mt-1 text-[11px] text-muted-foreground">
          ({count} reviews)
        </p>
      </div>

      <div className="p-3 md:border-l md:p-4">
        <div className="mx-auto max-w-sm space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const ratingCount = reviews.filter(
              (review) => review.rating === rating
            ).length

            const percentage = count ? (ratingCount / count) * 100 : 0

            return (
              <div key={rating} className="flex items-center gap-2 text-xs">
                <span className="w-10 shrink-0 font-medium">{rating} Star</span>

                <Progress value={percentage} className="h-1 flex-1" />

                <span className="w-6 text-right text-muted-foreground">
                  {ratingCount}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-center p-10 md:border-l md:p-4">
        <WriteReviewDialog />
      </div>
    </div>
  )
}
