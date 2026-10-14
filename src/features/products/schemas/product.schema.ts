import { z } from "zod"

export const productSchema = z.object({
  name: z.string().trim().min(1, "Product name is required"),
  subDescription: z.string().optional(),
  description: z.string().optional(),
  purchasePrice: z.number().min(0, "Purchase price cannot be negative"),
  sellingPrice: z.number().min(0, "Selling price cannot be negative"),
  categoryId: z.string().min(1, "Category is required"),
  brandId: z.string().optional(),
  sizeGuideId: z.string().optional(),
  status: z.enum(["DRAFT", "PROPOSED", "PUBLISHED", "REJECTED"]).optional(),
})

export type ProductFormValues = z.infer<typeof productSchema>
