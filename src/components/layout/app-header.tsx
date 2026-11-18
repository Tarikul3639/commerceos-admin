"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, CheckCheck, Moon, Search, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Permission } from "@/config/permissions.config"
import { usePermission } from "@/hooks/use-permission"
import {
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "@/features/notifications/api/notifications.api"
import type { Notification } from "@/features/notifications/types/notification.types"

import { AppBreadcrumb } from "./app-breadcrumb"

function formatNotificationDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

export function AppHeader() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const permission = usePermission()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const canReadNotifications = permission.has(Permission.NOTIFICATION_READ)

  const { data, isFetching } = useGetNotificationsQuery(
    { page: 1, limit: 5 },
    { skip: !canReadNotifications, pollingInterval: 60_000 }
  )
  const [markRead] = useMarkNotificationReadMutation()
  const [markAllRead, { isLoading: isMarkingAll }] =
    useMarkAllNotificationsReadMutation()

  const unreadCount = data?.meta.unreadCount ?? 0
  const notifications = data?.data ?? []

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      try {
        await markRead(notification.id).unwrap()
      } catch {
        return
      }
    }

    setNotificationsOpen(false)
    const link = notification.link
    router.push(
      link?.startsWith("/") && !link.startsWith("//")
        ? link
        : "/dashboard/notifications"
    )
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllRead().unwrap()
    } catch {
      // Keep the popover open if the request fails.
    }
  }

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleSearch = () => {
    // TODO: Open global search / command palette
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="flex w-full items-center gap-2 px-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarTrigger className="-ml-1" />
          </TooltipTrigger>
          <TooltipContent><p>Toggle Sidebar</p></TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="mr-2" />
        <AppBreadcrumb />

        <div className="ml-auto flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="hidden h-9 w-64 justify-start gap-2 text-muted-foreground md:flex lg:w-80"
                onClick={handleSearch}
              >
                <Search className="size-4" />
                <span className="flex-1 text-left">Search...</span>
                <kbd className="pointer-events-none hidden h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium select-none sm:flex">⌘ K</kbd>
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Search</p></TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground md:hidden"
                onClick={handleSearch}
                aria-label="Search"
              >
                <Search className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Search</p></TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground"
                onClick={handleThemeToggle}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}</p>
            </TooltipContent>
          </Tooltip>

          {canReadNotifications && (
            <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-muted-foreground"
                  aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
                >
                  <Bell className="size-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] leading-none font-semibold text-destructive-foreground ring-2 ring-background">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>

              <PopoverContent align="end" sideOffset={10} className="w-[min(24rem,calc(100vw-2rem))] gap-0 overflow-hidden p-0">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <div>
                    <h2 className="text-sm font-semibold">Notifications</h2>
                    <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1.5 px-2 text-xs"
                    disabled={unreadCount === 0 || isMarkingAll}
                    onClick={handleMarkAllRead}
                  >
                    <CheckCheck className="size-3.5" />
                    Read all
                  </Button>
                </div>

                <div className="max-h-[min(60vh,26rem)] overflow-y-auto">
                  {isFetching && notifications.length === 0 ? (
                    <p className="px-4 py-8 text-center text-sm text-muted-foreground">Loading notifications...</p>
                  ) : notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <Bell className="mx-auto mb-2 size-5 text-muted-foreground" />
                      <p className="text-sm font-medium">You’re all caught up</p>
                      <p className="mt-1 text-xs text-muted-foreground">New notifications will appear here.</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <button
                        key={notification.id}
                        type="button"
                        onClick={() => handleNotificationClick(notification)}
                        className="flex w-full gap-3 border-b px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none"
                      >
                        <span className={`mt-1.5 size-2 shrink-0 rounded-full ${notification.isRead ? "bg-muted-foreground/30" : "bg-primary"}`} />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-start justify-between gap-2">
                            <span className={`line-clamp-1 text-sm ${notification.isRead ? "font-medium" : "font-semibold"}`}>{notification.title}</span>
                            {!notification.isRead && <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />}
                          </span>
                          <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-muted-foreground">{notification.message}</span>
                          <span className="mt-1.5 block text-[11px] text-muted-foreground">{formatNotificationDate(notification.createdAt)}</span>
                        </span>
                      </button>
                    ))
                  )}
                </div>

                <div className="w-full justify-end border-t">
                  <Button
                    variant="ghost"
                    size="xs"
                    className="w-full"
                    onClick={() => {
                      setNotificationsOpen(false)
                      router.push("/dashboard/notifications")
                    }}
                  >
                    View all notifications
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </header>
  )
}
