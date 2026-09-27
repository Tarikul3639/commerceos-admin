"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import type { RolePermissions } from "../types/permissions.types"

interface RolePermissionsDialogProps {
  rolePermissions: RolePermissions | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RolePermissionsDialog({
  rolePermissions,
  open,
  onOpenChange,
}: RolePermissionsDialogProps) {
  if (!rolePermissions) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Role Permissions</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              Role
            </p>

            <Badge variant="secondary">{rolePermissions.role}</Badge>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Permissions</p>

              <span className="text-xs text-muted-foreground">
                {rolePermissions.permissions.length}
              </span>
            </div>

            {rolePermissions.permissions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {rolePermissions.permissions.map((permission) => (
                  <Badge key={permission} variant="outline">
                    {permission}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No permissions assigned.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
