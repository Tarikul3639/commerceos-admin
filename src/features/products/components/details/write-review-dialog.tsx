"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Rating } from "@/components/shared/rating"

const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, "Please select a rating")
    .max(5, "Rating must be between 1 and 5"),
  comment: z
    .string()
    .trim()
    .min(5, "Review must be at least 5 characters")
    .max(500, "Review must not exceed 500 characters"),
})

type ReviewFormValues = z.infer<typeof reviewSchema>

export function WriteReviewDialog() {
  const [open, setOpen] = useState(false)

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  })

  const onSubmit = (values: ReviewFormValues) => {
    console.log(values)

    form.reset()
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value)

        if (!value) {
          form.reset()
        }
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" size="sm">
          <Pencil className="mr-1 size-3.5" />
          Write your review
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Write your review</DialogTitle>
          <DialogDescription>
            Share your experience with this product.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <Field>
            <FieldLabel>Rating</FieldLabel>

            <div className="flex items-center gap-1">
              <Rating
                value={form.watch("rating")}
                size="lg"
                readOnly={false}
                showValue={false}
                showCount={false}
                onChange={(value) =>
                  form.setValue("rating", value, {
                    shouldValidate: true,
                  })
                }
              />
            </div>

            <FieldDescription>
              Select a rating from 1 to 5 stars.
            </FieldDescription>

            {form.formState.errors.rating && (
              <FieldError>{form.formState.errors.rating.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="review-comment">Your review</FieldLabel>

            <Textarea
              id="review-comment"
              placeholder="Tell us about your experience..."
              rows={5}
              {...form.register("comment")}
            />

            {form.formState.errors.comment && (
              <FieldError>{form.formState.errors.comment.message}</FieldError>
            )}
          </Field>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={form.formState.isSubmitting}>
              Submit review
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
