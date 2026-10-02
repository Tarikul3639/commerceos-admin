"use client"

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AppImage } from "@/components/media"

import type { Customer } from "../types/customers.types"

interface CustomerViewDialogProps {
  customer: Customer | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomerViewDialog({
  customer,
  open,
  onOpenChange,
}: CustomerViewDialogProps) {
  if (!customer) {
    return null
  }

  const statusVariant = (() => {
    switch (customer.status) {
      case "ACTIVE":
        return "default"
      case "INACTIVE":
        return "secondary"
      case "SUSPENDED":
      case "DELETED":
        return "destructive"
      default:
        return "default"
    }
  })()

  const formatDate = (date: string | null) => {
    if (!date) {
      return "Never"
    }

    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Profile */}
          <div className="flex items-center gap-3">
            <AppImage
              name={customer.name}
              image={customer.avatarUrl ?? undefined}
            />

            <div className="min-w-0">
              <h3 className="truncate font-semibold">{customer.name}</h3>

              <p className="truncate text-sm text-muted-foreground">
                {customer.email}
              </p>
            </div>

            <Badge variant={statusVariant} className="ml-auto">
              {customer.status}
            </Badge>
          </div>

          <Separator />

          {/* Contact */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              Contact
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-muted-foreground" />

                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="truncate text-sm">{customer.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="size-4 text-muted-foreground" />

                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm">{customer.phone ?? "—"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:col-span-2">
                <MapPin className="size-4 text-muted-foreground" />

                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="text-sm">{customer.address ?? "—"}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Account */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              Account
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-muted-foreground" />

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Verification</p>

                  <div className="flex items-center gap-1.5 text-sm">
                    {customer.isVerified ? (
                      <>
                        <CheckCircle2 className="size-3.5" />
                        Verified
                      </>
                    ) : (
                      "Unverified"
                    )}
                  </div>
                </div>
              </div>

              <div className="flex min-w-0 items-center gap-2.5">
                <Clock3 className="size-4 text-muted-foreground" />

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Last Login</p>

                  <p className="text-sm">{formatDate(customer.lastLoginAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <CalendarDays className="size-4 text-muted-foreground" />

                <div>
                  <p className="text-xs text-muted-foreground">Created</p>

                  <p className="text-sm">{formatDate(customer.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <UserRound className="size-4 text-muted-foreground" />

                <div className="min-w-0 space-y-1">
                  <p className="text-xs text-muted-foreground">Customer ID</p>

                  <p className="truncate text-sm">{customer.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
