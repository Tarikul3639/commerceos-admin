import { CalendarDays, CheckCircle2, Clock3 } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { CurrentUserResponse } from "@/features/auth/auth.types"

interface ProfileOverviewProps {
  user: CurrentUserResponse
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Not available"

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function ProfileOverview({ user }: ProfileOverviewProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar className="size-16 sm:size-20">
            <AvatarImage src={user.avatar ?? undefined} alt={user.name} />
            <AvatarFallback className="text-lg">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 space-y-1">
            <h2 className="truncate text-lg font-semibold">{user.name}</h2>
            <p className="truncate text-sm text-muted-foreground">
              {user.email}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Badge variant="secondary" className="capitalize">
                {user.role.toLowerCase().replaceAll("_", " ")}
              </Badge>
              {user.isVerified ? (
                <Badge variant="outline">
                  <CheckCircle2 className="mr-1 size-3" />
                  Verified
                </Badge>
              ) : (
                <Badge variant="outline">Email not verified</Badge>
              )}
            </div>
          </div>
        </div>
        <div className="grid gap-3 text-sm sm:min-w-52">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="size-4 shrink-0" />
            <span>Joined {formatDate(user.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock3 className="size-4 shrink-0" />
            <span>Last login {formatDate(user.lastLoginAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
