import { z } from "zod"
import { SIZE_GUIDE_UNITS } from "../types/size-guide.types"

const cellSchema = z.union([z.string(), z.number()])

export const sizeGuideSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  description: z.string().max(1000).optional().or(z.literal("")),
  unit: z.enum(SIZE_GUIDE_UNITS, {
    message: "Unit must be either 'cm' or 'in'",
  }),
  columns: z
    .array(z.string().trim().min(1, "Column name is required"))
    .min(1, "Add at least one column"),
  rows: z
    .array(z.record(z.string(), cellSchema))
    .min(1, "Add at least one size row"),
})

export type SizeGuideFormValues = z.infer<typeof sizeGuideSchema>