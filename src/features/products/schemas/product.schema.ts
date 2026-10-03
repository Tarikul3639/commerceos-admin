import { z } from "zod"

export const productFormSchema = z
  .object({
    name: z.string().min(1).max(255),
    sku: z.string().min(1, "SKU is required").max(255),
    barcode: z.string().optional(),
    description: z.string().optional(),
    subDescription: z.string().optional(),
    purchasePrice: z.number().min(0),
    sellingPrice: z.number().min(0),
    stock: z.number().int().min(0),
    categoryId: z.string().min(1),
    brandId: z.string().optional(),
    sizes: z.array(z.string()),
    colors: z.array(
      z.object({ name: z.string().min(1), hex: z.string().min(1) })
    ),
    images: z.array(
      z.object({
        id: z.string().optional(),
        imageUrl: z.string().url(),
        publicId: z.string().min(1),
        sortOrder: z.number().int().min(0),
      })
    ),
    isActive: z.boolean(),
    discountValue: z
      .string()
      .refine(
        (value) => value === "" || (Number(value) >= 0 && Number(value) <= 100),
        "Discount must be between 0 and 100"
      ),
    discountStartDate: z.string(),
    discountEndDate: z.string(),
  })
  .refine((values) => values.sellingPrice >= values.purchasePrice, {
    message: "Selling price cannot be lower than purchase price",
    path: ["sellingPrice"],
  })
  .refine(
    (values) =>
      !values.discountStartDate ||
      !values.discountEndDate ||
      values.discountEndDate >= values.discountStartDate,
    {
      message: "Discount end date must be on or after its start date",
      path: ["discountEndDate"],
    }
  )

export type ProductFormValues = z.infer<typeof productFormSchema>
