export interface SecuritySettings {
  id: string
  accessTokenLifetimeMinutes: number
  refreshTokenLifetimeDays: number
  rememberMeRefreshLifetimeDays: number
  minimumPasswordLength: number
  maximumFailedLoginAttempts: number
  accountLockoutDurationMinutes: number
  createdAt: string
  updatedAt: string
}

export type UpdateSecuritySettingsRequest = Partial<
  Pick<
    SecuritySettings,
    | "accessTokenLifetimeMinutes"
    | "refreshTokenLifetimeDays"
    | "rememberMeRefreshLifetimeDays"
    | "minimumPasswordLength"
    | "maximumFailedLoginAttempts"
    | "accountLockoutDurationMinutes"
  >
>
