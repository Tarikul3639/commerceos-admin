"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { EditPermissionsDialog } from "./edit-permissions-dialog"
import { RolePermissionsDialog } from "./role-permissions-dialog"

import type { RolePermissions } from "../types/permissions.types"

interface PermissionsActionsProps {
  rolePermissions: RolePermissions
}

export function PermissionsActions({
  rolePermissions,
}: PermissionsActionsProps) {
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

  return (
    <>
      <div className="flex w-full items-center justify-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)}>
          Edit
        </Button>

        <Button variant="outline" size="sm" onClick={() => setIsViewOpen(true)}>
          View
        </Button>
      </div>

      <EditPermissionsDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        rolePermissions={rolePermissions}
      />

      <RolePermissionsDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        rolePermissions={rolePermissions}
      />
    </>
  )
}
