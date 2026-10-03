import { z } from "zod"

export const purchaseSchema = z
  .object({
    supplierId: z.string().min(1, "Select a supplier"),
    items: z
      .array(
        z.object({
          productId: z.string().min(1, "Select a product"),
          quantity: z.number().int().min(1, "Quantity must be at least 1"),
          unitPrice: z.string().regex(/^-?\d+(\.\d+)?$/, "Enter a valid price"),
        })
      )
      .min(1, "Add at least one item"),
    discount: z
      .string()
      .regex(/^(?:-?\d+(\.\d+)?|)$/, "Enter a valid discount"),
    tax: z.string().regex(/^(?:-?\d+(\.\d+)?|)$/, "Enter a valid tax"),
  })
  .superRefine((value, ctx) => {
    if (
      new Set(value.items.map((item) => item.productId)).size !==
      value.items.length
    )
      ctx.addIssue({
        code: "custom",
        path: ["items"],
        message: "A product can only be added once",
      })
  })
export type PurchaseFormValues = z.infer<typeof purchaseSchema>
