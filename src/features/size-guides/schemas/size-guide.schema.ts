import { z } from "zod"

const cellSchema = z.union([z.string(), z.number()])

export const sizeGuideSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  description: z.string().max(1000).optional().or(z.literal("")),
  unit: z.string().trim().min(1, "Unit is required").max(20),
  columns: z
    .array(z.string().trim().min(1, "Column name is required"))
    .min(1, "Add at least one column"),
  rows: z
    .array(z.record(z.string(), cellSchema))
    .min(1, "Add at least one size row"),
})

export type SizeGuideFormValues = z.infer<typeof sizeGuideSchema>
