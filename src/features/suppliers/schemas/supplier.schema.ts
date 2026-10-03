import { z } from "zod"

export const supplierSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.union([z.email("Enter a valid email"), z.literal("")]).optional(),
  phone: z.string().max(30).optional(),
  address: z.string().max(500).optional(),
  contactPerson: z.string().max(255).optional(),
  isActive: z.boolean(),
})
export type SupplierFormValues = z.infer<typeof supplierSchema>
