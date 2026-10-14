import { z } from "zod"

const imageSchema = z.object({
    id: z.string().optional(),
    imageUrl: z.string().url("Invalid image URL"),
    publicId: z.string().min(1, "Image public ID is required"),
    sortOrder: z.number().int().min(0),
})

export const productImageSchema = z.object({
    images: z.array(imageSchema).default([]),
})

export type ProductImageFormValues = z.infer<typeof productImageSchema>