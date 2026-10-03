"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Rating } from "@/components/shared/rating"
import { WriteReviewDialog } from "./write-review-dialog"

import type { ProductReview } from "../../types/product.types"

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
                  <span className="w-10 shrink-0 font-medium">
                    {rating} Star
                  </span>

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

interface ProductReviewItemProps {
  review: ProductReview
}

function ProductReviewItem({ review }: ProductReviewItemProps) {
  return (
    <div className="flex gap-3 px-1 py-3 sm:p-3 md:gap-4 md:p-5">
      <Avatar className="size-8 shrink-0">
        <AvatarImage src={review.avatarUrl ?? undefined} />
        <AvatarFallback className="text-xs">C</AvatarFallback>
      </Avatar>

      <div className="flex flex-col items-start gap-1">
        <div>
          <p className="text-sm font-semibold">Customer</p>

          <p className="mt-0.5 text-xs text-muted-foreground capitalize">
            {new Date(review.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour12: true,
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div>
          <Rating value={review.rating} size="xs" />

          {review.comment && (
            <p className="mt-2 text-xs leading-5">{review.comment}</p>
          )}
        </div>
      </div>
    </div>
  )
}
