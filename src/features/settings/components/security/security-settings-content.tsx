"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RefreshCw, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

import { PageContainer } from "@/components/layout/page-container"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Permission } from "@/config/permissions.config"
import { UnauthorizedContent } from "@/features/permissions/components/unauthorized-content"
import { usePermission } from "@/hooks/use-permission"
import { cn } from "@/lib/utils"
import { getErrorMessage } from "@/lib/utils/error"

import {
  useGetSecuritySettingsQuery,
  useUpdateSecuritySettingsMutation,
} from "../../api/security-settings.api"
import { securitySettingsSchema } from "../../schemas/security-settings.schema"
import type { SecuritySettingsFormValues } from "../../schemas/security-settings.schema"
import type { UpdateSecuritySettingsRequest } from "../../types/security-settings.types"

const breadcrumbs = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Settings", href: "/dashboard/settings" },
  { label: "Security" },
]

const fields: {
  key: keyof SecuritySettingsFormValues
  label: string
  description: string
  min: number
  max: number
}[] = [
  {
    key: "accessTokenLifetimeMinutes",
    label: "Access token lifetime",
    description: "How long an admin access token remains valid.",
    min: 5,
    max: 60,
  },
  {
    key: "refreshTokenLifetimeDays",
    label: "Standard session lifetime",
    description: "Refresh-token lifetime for a normal sign-in.",
    min: 1,
    max: 90,
  },
  {
    key: "rememberMeRefreshLifetimeDays",
    label: "Remember-me session lifetime",
    description: "Refresh-token lifetime when the user selects Remember me.",
    min: 1,
    max: 180,
  },
  {
    key: "minimumPasswordLength",
    label: "Minimum password length",
    description:
      "Minimum characters required for new or changed staff passwords.",
    min: 8,
    max: 128,
  },
  {
    key: "maximumFailedLoginAttempts",
    label: "Maximum failed login attempts",
    description: "Failed password attempts allowed before a temporary lockout.",
    min: 3,
    max: 10,
  },
  {
    key: "accountLockoutDurationMinutes",
    label: "Account lockout duration",
    description:
      "How long a staff account remains locked after repeated failures.",
    min: 5,
    max: 1440,
  },
]

export function SecuritySettingsContent() {
  const permission = usePermission()
  const canUpdate = permission.has(Permission.SETTING_UPDATE)
  const { data, isLoading, isFetching, error, refetch } =
    useGetSecuritySettingsQuery()
  const [updateSettings, { isLoading: isSaving }] =
    useUpdateSecuritySettingsMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<SecuritySettingsFormValues>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      accessTokenLifetimeMinutes: 15,
      refreshTokenLifetimeDays: 7,
      rememberMeRefreshLifetimeDays: 30,
      minimumPasswordLength: 12,
      maximumFailedLoginAttempts: 5,
      accountLockoutDurationMinutes: 15,
    },
  })

  useEffect(() => {
    if (!data) return
    reset({
      accessTokenLifetimeMinutes: data.accessTokenLifetimeMinutes,
      refreshTokenLifetimeDays: data.refreshTokenLifetimeDays,
      rememberMeRefreshLifetimeDays: data.rememberMeRefreshLifetimeDays,
      minimumPasswordLength: data.minimumPasswordLength,
      maximumFailedLoginAttempts: data.maximumFailedLoginAttempts,
      accountLockoutDurationMinutes: data.accountLockoutDurationMinutes,
    })
  }, [data, reset])

  async function onSubmit(values: SecuritySettingsFormValues) {
    try {
      await updateSettings(values satisfies UpdateSecuritySettingsRequest).unwrap()
      toast.success("Security settings updated")
    } catch (error) {
      toast.error(
        getErrorMessage(error) || "Unable to update security settings"
      )
    }
  }

  return (
    <PageContainer
      access={permission.has(Permission.SETTING_READ)}
      accessFallback={<UnauthorizedContent />}
      title="Security Settings"
      breadcrumbs={breadcrumbs}
      pageHeaderAction={
        <Button
          variant="outline"
          size="sm"
          onClick={() => void refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={cn("size-4", isFetching && "animate-spin")} />
          Refresh
        </Button>
      }
    >
      <div className="mx-auto w-full space-y-6 pb-8">
        <div className="space-y-1">
          <h2 className="text-sm font-semibold tracking-tight">
            Authentication policy
          </h2>
          <p className="text-sm text-muted-foreground">
            Control staff session duration, password strength and protection
            against repeated sign-in attempts.
          </p>
        </div>

        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Could not load security settings</AlertTitle>
            <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
              <span>Security policy is temporarily unavailable.</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void refetch()}
              >
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        ) : isLoading || !data ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-72 max-w-full" />
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              {fields.map((field) => (
                <Skeleton key={field.key} className="h-20" />
              ))}
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-muted-foreground" />
                  <CardTitle className="text-base">Security policy</CardTitle>
                </div>
                <CardDescription>
                  Recommended defaults are preconfigured. Updates take effect on
                  subsequent sign-ins and token issuance.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                {fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label htmlFor={field.key}>{field.label}</Label>
                    <Input
                      id={field.key}
                      type="number"
                      min={field.min}
                      max={field.max}
                      step={1}
                      {...register(field.key, { valueAsNumber: true })}
                      disabled={!canUpdate || isSaving}
                      aria-invalid={!!errors[field.key]}
                    />
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {field.description} ({field.min}–{field.max})
                    </p>
                    {errors[field.key]?.message && (
                      <p className="text-xs text-destructive" role="alert">
                        {errors[field.key]?.message}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Alert>
              <AlertTitle>How password policy works</AlertTitle>
              <AlertDescription className="text-xs leading-relaxed">
                Passwords must meet the configured minimum length. This policy
                is enforced when staff change or reset their password. Customer
                authentication is not affected by these staff security settings.
              </AlertDescription>
            </Alert>

            {canUpdate && isDirty && (
              <div className="flex justify-end">
                <Button type="submit" disabled={isSaving || isFetching}>
                  {isSaving ? "Saving..." : "Save security settings"}
                </Button>
              </div>
            )}
          </form>
        )}
      </div>
    </PageContainer>
  )
}
