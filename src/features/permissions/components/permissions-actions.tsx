"use client"

import { useState } from "react"
import { Info, SquarePen } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { UpdatePermissionsDialog } from "./update-permissions-dialog"
import { RolePermissionsDialog } from "./role-permissions-dialog"

import type { RolePermissions } from "../types/permissions.types"

interface PermissionsActionsProps {
  rolePermissions: RolePermissions
}

export function PermissionsActions({
  rolePermissions,
}: PermissionsActionsProps) {
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)

  return (
    <>
      <TooltipProvider>
        <div className="flex w-full items-center justify-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsUpdateOpen(true)}
              >
                <SquarePen className="size-4" />
                <span className="sr-only">Update</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Update permissions</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsViewOpen(true)}
              >
                <Info className="size-4" />
                <span className="sr-only">View</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>View permissions</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      <UpdatePermissionsDialog
        open={isUpdateOpen}
        onOpenChange={setIsUpdateOpen}
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
