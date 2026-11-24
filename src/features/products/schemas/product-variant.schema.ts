import { z } from "zod"

export const productVariantSchema = z.object({
  sku: z.string().trim().min(1, "SKU is required").max(100, "SKU is too long"),
  barcode: z
    .string()
    .trim()
    .min(1, "Barcode is required")
    .max(100, "Barcode is too long"),
  options: z.record(z.string(), z.string()),
  isActive: z.boolean(),
})

export type ProductVariantFormValues = z.infer<typeof productVariantSchema>
