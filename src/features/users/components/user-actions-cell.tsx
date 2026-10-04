"use client"

import {
  CircleCheck,
  CirclePause,
  Info,
  MoreHorizontal,
  Pencil,
  ShieldPlus,
  Trash2,
  XCircle,
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { UpdateUserDialog } from "./update-user-dialog"
import { UserDetailsDialog } from "./user-details-dialog"
import { useIsMe } from "@/hooks/use-is-me"

import {
  useDeleteUserMutation,
  useRestoreUserMutation,
  useUpdateUserStatusMutation,
} from "../api/user.api"

import { UserStatus, type User } from "../types/user.types"

interface UserActionsCellProps {
  user: User
}

export function UserActionsCell({ user }: UserActionsCellProps) {
  const isMe = useIsMe(user.id)

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [isRestoreOpen, setIsRestoreOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const [updateUserStatus, { isLoading: isUpdatingStatus }] =
    useUpdateUserStatusMutation()

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()
  const [restoreUser, { isLoading: isRestoring }] = useRestoreUserMutation()

  const handleUpdateUserStatus = async (status: UserStatus) => {
    try {
      await updateUserStatus({
        userId: user.id,
        data: { status },
      }).unwrap()

      toast.success(`User status updated to ${status}`)
    } catch (error) {
      console.error("Error updating user status:", error)

      toast.error("Failed to update user status")
    }
  }

  const handleDeleteUser = async () => {
    try {
      await deleteUser(user.id).unwrap()

      toast.success("User deleted successfully")

      setIsDeleteOpen(false)
    } catch (error) {
      console.error("Error deleting user:", error)

      toast.error("Failed to delete user")
    }
  }

  const handleRestoreUser = async () => {
    try {
      await restoreUser(user.id).unwrap()

      toast.success("User restored successfully")
      setIsRestoreOpen(false)
    } catch (error) {
      console.error("Error restoring user:", error)
      toast.error("Failed to restore user")
    }
  }

  if (isMe) {
    return (
      <div className="flex w-full items-center justify-center">
        <Badge variant="secondary">Me</Badge>
      </div>
    )
  }

  return (
    <>
      <div className="flex w-full justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />

              <span className="sr-only">Open actions for {user.name}</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40 p-1">
            {/* General */}
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                General
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => setIsDetailOpen(true)}>
                <Info className="h-4 w-4" />
                Details
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setIsUpdateOpen(true)}>
                <Pencil className="h-4 w-4" />
                Update
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Status */}
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                Status
              </DropdownMenuLabel>

              {user.status === UserStatus.ACTIVE && (
                <>
                  <DropdownMenuItem
                    disabled={isUpdatingStatus}
                    onClick={() => handleUpdateUserStatus(UserStatus.INACTIVE)}
                  >
                    <CirclePause className="h-4 w-4" />
                    Deactivate
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    variant="destructive"
                    disabled={isUpdatingStatus}
                    onClick={() => handleUpdateUserStatus(UserStatus.SUSPENDED)}
                  >
                    <XCircle className="h-4 w-4" />
                    Suspend
                  </DropdownMenuItem>
                </>
              )}

              {user.status === UserStatus.INACTIVE && (
                <>
                  <DropdownMenuItem
                    disabled={isUpdatingStatus}
                    onClick={() => handleUpdateUserStatus(UserStatus.ACTIVE)}
                  >
                    <CircleCheck className="h-4 w-4" />
                    Activate
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    variant="destructive"
                    disabled={isUpdatingStatus}
                    onClick={() => handleUpdateUserStatus(UserStatus.SUSPENDED)}
                  >
                    <XCircle className="h-4 w-4" />
                    Suspend
                  </DropdownMenuItem>
                </>
              )}

              {user.status === UserStatus.SUSPENDED && (
                <DropdownMenuItem
                  disabled={isUpdatingStatus}
                  onClick={() => handleUpdateUserStatus(UserStatus.ACTIVE)}
                >
                  <CircleCheck className="h-4 w-4" />
                  Activate
                </DropdownMenuItem>
              )}

              {user.status === UserStatus.DELETED && (
                <DropdownMenuItem
                  disabled={isUpdatingStatus}
                  onClick={() => setIsRestoreOpen(true)}
                >
                  <ShieldPlus className="h-4 w-4" />
                  Restore
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>

            {/* Danger Zone */}
            {user.status !== UserStatus.DELETED && (
              <>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuLabel className="px-2 py-1.5 text-xs font-medium text-destructive">
                    Danger Zone
                  </DropdownMenuLabel>

                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => setIsDeleteOpen(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete <strong>{user.name}</strong>? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>

            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDeleteUser}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Restore Confirmation */}
      <AlertDialog open={isRestoreOpen} onOpenChange={setIsRestoreOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore user?</AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to restore <strong>{user.name}</strong>?
              This action will reactivate the user's account.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRestoring}>Cancel</AlertDialogCancel>

            <AlertDialogAction
              variant="destructive"
              disabled={isRestoring}
              onClick={handleRestoreUser}
            >
              {isRestoring ? "Restoring..." : "Restore"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Update User Dialog */}
      <UpdateUserDialog
        user={user}
        open={isUpdateOpen}
        onOpenChange={setIsUpdateOpen}
      />

      {/* User Details Dialog */}
      <UserDetailsDialog
        user={user}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </>
  )
}
