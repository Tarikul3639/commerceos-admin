import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { CurrentUserResponse } from "@/features/auth/auth.types"

interface AccountInformationCardProps {
  user: CurrentUserResponse
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Not available"

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

export function AccountInformationCard({ user }: AccountInformationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Account information</CardTitle>
        <CardDescription>
          Your account role and verification status are managed by your
          organization.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Account role</span>
          <span className="font-medium capitalize">
            {user.role.toLowerCase().replaceAll("_", " ")}
          </span>
        </div>
        <Separator />
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Email verification</span>
          <span className="font-medium">
            {user.isVerified ? "Verified" : "Pending"}
          </span>
        </div>
        <Separator />
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Account created</span>
          <span className="text-right font-medium">
            {formatDate(user.createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
