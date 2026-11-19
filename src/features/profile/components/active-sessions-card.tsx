"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Clock3,
  Globe,
  Laptop,
  LogOut,
  MapPin,
  Monitor,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Tablet,
} from "lucide-react"
import { toast } from "sonner"
import { UAParser } from "ua-parser-js"

import { ConfirmDialog } from "@/components/dialogs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useGetActiveSessionsQuery,
  useLogoutOtherSessionsMutation,
  useRevokeSessionMutation,
} from "@/features/auth/auth.api"
import type { ActiveSession } from "@/features/auth/auth.types"
import { getErrorMessage } from "@/lib/utils/error"
import { logout } from "@/store/slices/auth.slice"
import { useAppDispatch } from "@/store/hooks"

function formatDate(value: string | null | undefined) {
  if (!value) return "Not available"

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

function getBrowserName(userAgent: string | null) {
  return (
    (userAgent ? new UAParser(userAgent).getResult().browser.name : null) ??
    "Unknown browser"
  )
}

function getDeviceName(userAgent: string | null) {
  if (!userAgent) return "Unknown device"

  const result = new UAParser(userAgent).getResult()

  switch (result.device.type) {
    case "mobile":
      return "Mobile device"
    case "tablet":
      return "Tablet"
    case "smarttv":
      return "Smart TV"
    case "wearable":
      return "Wearable device"
    case "console":
      return "Game console"
    case "embedded":
      return "Embedded device"
    default:
      return result.os.name ? "Desktop computer" : "Unknown device"
  }
}

function getOperatingSystem(userAgent: string | null) {
  if (!userAgent) return "Unknown operating system"

  const os = new UAParser(userAgent).getResult().os
  if (!os.name) return "Unknown operating system"

  return os.version ? `${os.name} ${os.version}` : os.name
}

function DeviceIcon({ userAgent }: { userAgent: string | null }) {
  const deviceType = userAgent
    ? new UAParser(userAgent).getResult().device.type
    : undefined

  if (deviceType === "mobile") {
    return <Smartphone className="size-5 text-muted-foreground" />
  }
  if (deviceType === "tablet") {
    return <Tablet className="size-5 text-muted-foreground" />
  }
  if (!deviceType && userAgent) {
    return <Laptop className="size-5 text-muted-foreground" />
  }
  return <Monitor className="size-5 text-muted-foreground" />
}

export function ActiveSessionsCard() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { data, isLoading, isFetching, error, refetch } =
    useGetActiveSessionsQuery()
  const [revokeSession, { isLoading: isRevoking }] = useRevokeSessionMutation()
  const [logoutOtherSessions, { isLoading: isLoggingOutOthers }] =
    useLogoutOtherSessionsMutation()
  const [selectedSession, setSelectedSession] = useState<ActiveSession | null>(
    null
  )
  const [logoutOthersDialogOpen, setLogoutOthersDialogOpen] = useState(false)

  const sessions = data?.data ?? []

  async function handleRevokeSession() {
    if (!selectedSession) return

    try {
      const result = await revokeSession(selectedSession.id).unwrap()
      setSelectedSession(null)
      toast.success("Session signed out successfully")

      if (result.isCurrent) {
        dispatch(logout())
        router.replace("/login")
      }
    } catch (revokeError) {
      toast.error(getErrorMessage(revokeError) || "Unable to sign out session")
    }
  }

  async function handleLogoutOtherSessions() {
    try {
      const result = await logoutOtherSessions().unwrap()
      setLogoutOthersDialogOpen(false)
      toast.success(
        result.revokedCount === 0
          ? "No other active sessions found"
          : `Signed out ${result.revokedCount} other session(s)`
      )
    } catch (logoutError) {
      toast.error(
        getErrorMessage(logoutError) || "Unable to sign out other sessions"
      )
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-muted-foreground" />
                <CardTitle className="text-base">Active sessions</CardTitle>
              </div>
              <CardDescription>
                Devices and browsers currently signed in to your account.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void refetch()}
                disabled={isFetching}
              >
                <RefreshCw
                  className={`size-4 ${isFetching ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              {sessions.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => setLogoutOthersDialogOpen(true)}
                  disabled={isLoggingOutOthers}
                >
                  <LogOut className="size-4" />
                  Sign out others
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {error ? (
            <Alert variant="destructive">
              <AlertTitle>Unable to load active sessions</AlertTitle>
              <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
                <span>
                  Your active session information could not be retrieved.
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void refetch()}
                >
                  Try again
                </Button>
              </AlertDescription>
            </Alert>
          ) : isLoading ? (
            <>
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </>
          ) : sessions.length === 0 ? (
            <p className="rounded-lg border border-dashed p-5 text-center text-sm text-muted-foreground">
              No active sessions were found.
            </p>
          ) : (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Active devices</span>
                <Badge variant="secondary">{sessions.length}</Badge>
              </div>
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="mt-0.5 rounded-md bg-muted p-2">
                      <DeviceIcon userAgent={session.userAgent} />
                    </div>
                    <div className="min-w-0 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium">
                          {getDeviceName(session.userAgent)}
                        </p>
                        {session.isCurrent && (
                          <Badge variant="default">This device</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {getBrowserName(session.userAgent)} ·{" "}
                        {getOperatingSystem(session.userAgent)}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="size-3" />
                          {session.ipAddress || "IP unavailable"}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock3 className="size-3" />
                          Last active: {formatDate(session.lastUsedAt)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Globe className="size-3" />
                          Signed in: {formatDate(session.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                    onClick={() => setSelectedSession(session)}
                    disabled={isRevoking}
                  >
                    <LogOut className="size-4" />
                    Sign out
                  </Button>
                </div>
              ))}
            </>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!selectedSession}
        onOpenChange={(open) => {
          if (!open) setSelectedSession(null)
        }}
        title="Sign out this device?"
        description="This device will lose access to your account. If it is your current device, you will be redirected to the login page."
        confirmLabel="Sign out"
        onConfirm={() => void handleRevokeSession()}
        isLoading={isRevoking}
      />

      <ConfirmDialog
        open={logoutOthersDialogOpen}
        onOpenChange={setLogoutOthersDialogOpen}
        title="Sign out all other devices?"
        description="All other devices and browsers will be signed out. Your current device will remain active."
        confirmLabel="Sign out others"
        onConfirm={() => void handleLogoutOtherSessions()}
        isLoading={isLoggingOutOthers}
      />
    </>
  )
}
