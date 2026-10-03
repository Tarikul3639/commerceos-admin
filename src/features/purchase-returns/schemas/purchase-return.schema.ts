import { z } from "zod"

export const purchaseReturnSchema = z.object({
  purchaseId: z.string().min(1, "Select a received purchase"),
  reason: z.string().optional(),
  items: z
    .array(
      z.object({
        purchaseItemId: z.string().min(1),
        quantity: z.number().int().min(0),
        reason: z.string().optional(),
      })
    )
    .min(1),
})

export type PurchaseReturnFormValues = z.infer<typeof purchaseReturnSchema>
