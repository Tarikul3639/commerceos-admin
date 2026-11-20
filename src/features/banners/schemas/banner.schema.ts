import { z } from "zod"

import { BannerPosition, BannerType } from "../types/banners.types"

export const bannerSchema = z
  .object({
    title: z.string().trim().max(255, "Title must not exceed 255 characters"),
    images: z
      .array(
        z.object({
          imageUrl: z.string().url("Upload a valid banner image"),
          publicId: z.string().min(1, "Upload a valid banner image"),
          sortOrder: z.number().int().min(0),
        })
      )
      .min(1, "Upload at least one banner image"),
    type: z.enum(BannerType),
    position: z.enum(BannerPosition),
    link: z.string().max(500, "Link must not exceed 500 characters"),
    buttonText: z
      .string()
      .max(100, "Button text must not exceed 100 characters"),
    openInNewTab: z.boolean(),
    sortOrder: z
      .string()
      .regex(/^\d+$/, "Sort order must be a non-negative whole number"),
    isActive: z.boolean(),
    startAt: z.string(),
    endAt: z.string(),
  })
  .superRefine((values, context) => {
    if (
      values.startAt &&
      values.endAt &&
      new Date(values.startAt).getTime() > new Date(values.endAt).getTime()
    ) {
      context.addIssue({
        code: "custom",
        path: ["endAt"],
        message: "End date must be after the start date.",
      })
    }
  })

export type BannerFormValues = z.infer<typeof bannerSchema>
