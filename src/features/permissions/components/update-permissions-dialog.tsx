"use client"

import { useEffect, useState } from "react"
import { Loader2, Pencil, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { FieldGroup, FieldLabel, Field } from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

import { Permission } from "@/config/permissions.config"
import { permissionGroups } from "@/config/permission-groups.config"
import { useUpdateRolePermissionsMutation } from "../api/permissions.api"
import type { RolePermissions } from "../types/permissions.types"
import { getErrorMessage } from "@/lib/utils/error"
import { Badge } from "@/components/ui/badge"

interface UpdatePermissionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rolePermissions: RolePermissions | null
}

export function UpdatePermissionsDialog({
  open,
  onOpenChange,
  rolePermissions,
}: UpdatePermissionsDialogProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>(
    []
  )

  const [updateRolePermissions, { isLoading }] =
    useUpdateRolePermissionsMutation()

  useEffect(() => {
    if (rolePermissions) {
      setSelectedPermissions(rolePermissions.permissions)
    }
  }, [rolePermissions])

  const handlePermissionChange = (permission: Permission, checked: boolean) => {
    setSelectedPermissions((current) => {
      if (checked) {
        return current.includes(permission) ? current : [...current, permission]
      }

      return current.filter((item) => item !== permission)
    })
  }

  const handleGroupSelectAllToggle = (
    permissions: Permission[],
    checked: boolean
  ) => {
    setSelectedPermissions((current) => {
      if (checked) {
        return Array.from(new Set([...current, ...permissions]))
      }

      return current.filter((permission) => !permissions.includes(permission))
    })
  }

  const allAvailablePermissions = Object.values(permissionGroups).flatMap(
    (group) => Object.values(group)
  )

  const handleSelectAllGlobal = () => {
    const allSelected =
      selectedPermissions.length === allAvailablePermissions.length

    setSelectedPermissions(allSelected ? [] : allAvailablePermissions)
  }

  const isDirty =
    (!!rolePermissions &&
      selectedPermissions.length !== rolePermissions.permissions.length) ||
    (!!rolePermissions &&
      !selectedPermissions.every((permission) =>
        rolePermissions.permissions.includes(permission)
      ))

  const handleSubmit = async () => {
    if (!rolePermissions) return

    try {
      await updateRolePermissions({
        role: rolePermissions.role,
        payload: {
          permissions: selectedPermissions,
        },
      }).unwrap()

      toast.success("Permissions updated successfully.")
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to update permissions. Please try again.", {
        description: getErrorMessage(error),
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 sm:max-w-xl">
        <DialogHeader className="pb-3">
          <DialogTitle>Update Permissions</DialogTitle>

          <DialogDescription>
            Manage permissions assigned to the{" "}
            <span className="font-medium text-foreground">
              {rolePermissions?.role}
            </span>{" "}
            role.
          </DialogDescription>
        </DialogHeader>

        {/* Global Controls */}
        <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2.5">
          <span className="text-xs font-medium text-muted-foreground">
            Selected {selectedPermissions.length} /{" "}
            {allAvailablePermissions.length}
          </span>

          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={handleSelectAllGlobal}
            className="h-7 px-2 text-xs font-medium"
            disabled={isLoading}
          >
            {selectedPermissions.length === allAvailablePermissions.length
              ? "Deselect All"
              : "Select All"}
          </Button>
        </div>

        {/* Permissions List */}
        <div className="max-h-[60vh] overflow-y-auto py-2">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Object.entries(permissionGroups).map(
              ([groupName, permissions]) => {
                const isGroupAllSelected = Object.values(permissions).every(
                  (permission) => selectedPermissions.includes(permission)
                )
                const groupPermList = Object.values(permissions)
                const selectedInGroupCount = groupPermList.filter(
                  (permission) => selectedPermissions.includes(permission)
                ).length

                const handleGroupToggle = (
                  groupPermissions: Permission[],
                  selectAll: boolean
                ) => {
                  handleGroupSelectAllToggle(groupPermissions, !selectAll)
                }
                return (
                  <div
                    key={groupName}
                    className="rounded-lg border hover:border-primary/50"
                  >
                    {/* Group Header */}
                    <div className="flex items-center justify-between gap-2 border-b bg-muted/40 px-3.5 py-2.5">
                      <div className="flex min-w-0 items-center gap-2">
                        <h3 className="truncate text-sm font-semibold">
                          {groupName}
                        </h3>
                        <Badge
                          variant={
                            selectedInGroupCount > 0 ? "default" : "outline"
                          }
                          className="h-4 px-1.5 py-0 text-[10px] font-normal"
                        >
                          {selectedInGroupCount}/{groupPermList.length}
                        </Badge>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={() =>
                          handleGroupToggle(groupPermList, isGroupAllSelected)
                        }
                        className="text-[11px] font-medium"
                        disabled={isLoading}
                      >
                        {isGroupAllSelected ? "Deselect Group" : "Select Group"}
                      </Button>
                    </div>

                    {/* Permissions */}
                    <div className="space-y-1 p-2">
                      {Object.entries(permissions).map(
                        ([action, permission]) => {
                          const checked =
                            selectedPermissions.includes(permission)

                          return (
                            <FieldGroup
                              key={permission}
                              className={`gap-3 px-2 py-1 hover:bg-muted/40 ${checked && "bg-muted/40"}`}
                            >
                              <Field orientation="horizontal">
                                <Checkbox
                                  id={`permission-${permission}`}
                                  checked={checked}
                                  onCheckedChange={(value) =>
                                    handlePermissionChange(
                                      permission,
                                      value === true
                                    )
                                  }
                                  disabled={isLoading}
                                />

                                <FieldLabel>{action}</FieldLabel>
                              </Field>
                            </FieldGroup>
                          )
                        }
                      )}
                    </div>
                  </div>
                )
              }
            )}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="flex flex-row items-center justify-between gap-2 pt-3">
          <span className="hidden text-xs text-muted-foreground sm:inline-block">
            Changes will take effect immediately upon saving.
          </span>

          <div className="ml-auto flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSelectedPermissions(rolePermissions?.permissions || [])
                onOpenChange(false)
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || !rolePermissions || !isDirty}
              className="min-w-[110px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
