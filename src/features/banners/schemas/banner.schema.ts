import { z } from "zod"

import { BannerPosition, BannerType } from "../types/banners.types"

const imageUrlSchema = z.string().url("Upload a valid banner image")
const publicIdSchema = z.string().min(1, "Upload a valid banner image")

export const bannerSchema = z
  .object({
    title: z.string().trim().max(255, "Title must not exceed 255 characters"),
    imageUrl: imageUrlSchema,
    imagePublicId: publicIdSchema,
    mobileImageUrl: z.union([z.literal(""), imageUrlSchema]),
    mobileImagePublicId: z.union([z.literal(""), publicIdSchema]),
    type: z.enum(BannerType),
    position: z.enum(BannerPosition),
    link: z.string().max(500, "Link must not exceed 500 characters"),
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
      Boolean(values.mobileImageUrl) !== Boolean(values.mobileImagePublicId)
    ) {
      context.addIssue({
        code: "custom",
        path: ["mobileImageUrl"],
        message: "Upload both the mobile image and its Cloudinary reference.",
      })
    }

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
