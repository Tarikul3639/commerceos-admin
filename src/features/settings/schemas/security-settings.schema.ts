import { z } from "zod"

export const securitySettingsSchema = z
  .object({
    accessTokenLifetimeMinutes: z.number().int().min(5).max(60),
    refreshTokenLifetimeDays: z.number().int().min(1).max(90),
    rememberMeRefreshLifetimeDays: z.number().int().min(1).max(180),
    minimumPasswordLength: z.number().int().min(8).max(128),
    maximumFailedLoginAttempts: z.number().int().min(3).max(10),
    accountLockoutDurationMinutes: z.number().int().min(5).max(1440),
  })
  .refine(
    (values) =>
      values.rememberMeRefreshLifetimeDays >=
      values.refreshTokenLifetimeDays,
    {
      message:
        "Remember-me lifetime must be at least the standard session lifetime.",
      path: ["rememberMeRefreshLifetimeDays"],
    }
  )

export type SecuritySettingsFormValues = z.infer<typeof securitySettingsSchema>
