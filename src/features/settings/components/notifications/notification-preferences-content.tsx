"use client"

import { Bell, Mail, RefreshCw } from "lucide-react"
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
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Permission } from "@/config/permissions.config"
import { UnauthorizedContent } from "@/features/permissions/components/unauthorized-content"
import { usePermission } from "@/hooks/use-permission"
import { cn } from "@/lib/utils"
import { getErrorMessage } from "@/lib/utils/error"

import {
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
} from "../../api/notification-preferences.api"
import type { UpdateNotificationPreferencesRequest } from "../../types/notification-preferences.types"

const breadcrumbs = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Settings", href: "/dashboard/settings" },
  { label: "Notifications" },
]

const categories = [
  {
    key: "orders",
    title: "New orders",
    description: "When a customer places an order.",
    inApp: "ordersInApp" as const,
    email: "ordersEmail" as const,
  },
  {
    key: "returns",
    title: "Order returns",
    description: "When a customer submits or updates a return request.",
    inApp: "returnsInApp" as const,
    email: "returnsEmail" as const,
  },
  {
    key: "inventory",
    title: "Inventory alerts",
    description: "Low-stock and out-of-stock operational alerts.",
    inApp: "inventoryInApp" as const,
    email: "inventoryEmail" as const,
  },
  {
    key: "payments",
    title: "Payment alerts",
    description: "Payment failures and payment-status exceptions.",
    inApp: "paymentsInApp" as const,
    email: "paymentsEmail" as const,
  },
]

export function NotificationPreferencesContent() {
  const permission = usePermission()
  const canRead = permission.has(Permission.SETTING_READ)
  const canUpdate = permission.has(Permission.SETTING_UPDATE)

  const { data, isLoading, isFetching, error, refetch } =
    useGetNotificationPreferencesQuery(undefined, { skip: !canRead })

  const [updatePreferences, { isLoading: isSaving }] =
    useUpdateNotificationPreferencesMutation()

  async function handleToggle(
    key: keyof UpdateNotificationPreferencesRequest,
    checked: boolean
  ) {
    try {
      await updatePreferences({ [key]: checked }).unwrap()
      toast.success("Notification preference saved")
    } catch (error) {
      toast.error(
        getErrorMessage(error) || "Unable to save notification preference"
      )
    }
  }

  return (
    <PageContainer
      access={canRead}
      accessFallback={<UnauthorizedContent />}
      title="Notification Settings"
      breadcrumbs={breadcrumbs}
      pageHeaderAction={
        <Button
          variant="outline"
          size="sm"
          onClick={() => void refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={cn("size-4", isFetching && "animate-spin")} />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      }
    >
      <div className="mx-auto w-full space-y-6 pb-8">
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Could not load notification settings</AlertTitle>
            <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
              <span>
                Your notification preferences are temporarily unavailable.
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void refetch()}
                disabled={isFetching}
              >
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        ) : isLoading || !data ? (
          <Card>
            <CardHeader className="space-y-2">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-4 w-72 max-w-full" />
            </CardHeader>
            <CardContent className="space-y-5">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-56 max-w-full" />
                  </div>
                  <div className="flex gap-8">
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-6 w-12" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="size-4 text-muted-foreground" />
                Notification channels
              </CardTitle>
              <CardDescription>
                Enable or disable each channel for the notification types below.
                Changes are saved automatically.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div
                className={cn("transition-opacity", isFetching && "opacity-70")}
              >
                <div className="hidden grid-cols-[minmax(0,1fr)_112px_112px] items-center gap-4 border-b pb-3 sm:grid">
                  <span className="text-xs font-medium text-muted-foreground">
                    Notification type
                  </span>
                  <span className="flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
                    <Bell className="size-3.5" />
                    In-app
                  </span>
                  <span className="flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
                    <Mail className="size-3.5" />
                    Email
                  </span>
                </div>

                <div className="divide-y">
                  {categories.map((category) => (
                    <div
                      key={category.key}
                      className="grid gap-4 py-4 sm:grid-cols-[minmax(0,1fr)_112px_112px] sm:items-center"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{category.title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {category.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-3 sm:justify-center">
                        <span className="flex items-center gap-2 text-sm text-muted-foreground sm:hidden">
                          <Bell className="size-3.5" />
                          In-app
                        </span>
                        <Switch
                          checked={data[category.inApp]}
                          onCheckedChange={(checked) =>
                            void handleToggle(category.inApp, checked)
                          }
                          disabled={!canUpdate || isSaving}
                          aria-label={category.title + " in-app notifications"}
                        />
                      </div>

                      <div className="flex items-center justify-between gap-3 sm:justify-center">
                        <span className="flex items-center gap-2 text-sm text-muted-foreground sm:hidden">
                          <Mail className="size-3.5" />
                          Email
                        </span>
                        <Switch
                          checked={data[category.email]}
                          onCheckedChange={(checked) =>
                            void handleToggle(category.email, checked)
                          }
                          disabled={!canUpdate || isSaving}
                          aria-label={category.title + " email notifications"}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Alert>
          <AlertTitle>About transactional emails</AlertTitle>
          <AlertDescription className="text-xs leading-relaxed">
            Email verification, password resets and customer order-confirmation
            messages are transactional communications and are not affected by
            these preferences. Email settings apply to staff operational alerts
            connected to the notification delivery service.
          </AlertDescription>
        </Alert>
      </div>
    </PageContainer>
  )
}
