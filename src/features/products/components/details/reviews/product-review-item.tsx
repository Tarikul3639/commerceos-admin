import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Rating } from "@/components/shared/rating"
import type { ProductReview } from "../../../types/product.types"

interface ProductReviewItemProps {
  review: ProductReview
}

export function ProductReviewItem({ review }: ProductReviewItemProps) {
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
