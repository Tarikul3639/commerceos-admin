"use client"

import { Mail, Phone, ShieldCheck, UserRound } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { AppImage } from "@/components/media"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import type { User } from "../types/user.types"

interface UserDetailsDialogProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserDetailsDialog({
  user,
  open,
  onOpenChange,
}: UserDetailsDialogProps) {
  if (!user) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Profile */}
          <div className="flex items-center gap-4">
            <AppImage
              name={user.name}
              image={user.avatar ?? undefined}
              className="size-14 rounded-full object-cover"
            />

            <div className="min-w-0">
              <h3 className="truncate font-semibold">{user.name}</h3>

              <p className="truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>

          <Separator />

          {/* Basic Information */}
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailItem icon={<Mail />} label="Email" value={user.email} />

            <DetailItem
              icon={<Phone />}
              label="Phone"
              value={user.phone ?? "Not provided"}
            />

            <DetailItem icon={<ShieldCheck />} label="Role" value={user.role} />

            <DetailItem
              label="Status"
              value={<Badge variant="secondary">{user.status}</Badge>}
            />

            <DetailItem
              label="Verification"
              value={
                <Badge variant={user.isVerified ? "default" : "secondary"}>
                  {user.isVerified ? "Verified" : "Not verified"}
                </Badge>
              }
            />

            <DetailItem
              label="Public ID"
              value={user.publicId ?? "Not provided"}
            />
          </div>

          <Separator />

          {/* Dates */}
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailItem
              label="Last Login"
              value={formatDate(user.lastLoginAt)}
            />

            <DetailItem label="Created At" value={formatDate(user.createdAt)} />

            <DetailItem label="Updated At" value={formatDate(user.updatedAt)} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface DetailItemProps {
  label: string
  value: React.ReactNode
  icon?: React.ReactNode
}

function DetailItem({ label, value, icon }: DetailItemProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase">
        {icon && <span className="*:size-3.5">{icon}</span>}

        <span>{label}</span>
      </div>

      <div className="text-sm font-medium wrap-break-word">{value}</div>
    </div>
  )
}

function formatDate(value: string | null) {
  if (!value) {
    return "Never"
  }

  return new Date(value).toLocaleString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour12: true,
    hour: "numeric",
    minute: "numeric",
  })
}
