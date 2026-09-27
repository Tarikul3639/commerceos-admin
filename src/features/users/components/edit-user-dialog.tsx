"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { getErrorMessage } from "@/lib/utils/error"
import { Role } from "@/config/roles.config"

import { useUpdateUserMutation } from "../api/user.api"
import { userSchema, type UserFormValues } from "../schemas/user.schema"
import type { User } from "../types/user.types"

import { UserForm } from "./user-form"

interface EditUserDialogProps {
    user: User
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EditUserDialog({
    user,
    open,
    onOpenChange,
}: EditUserDialogProps) {
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
            phone: user.phone ?? "",
            avatar: user.avatar ?? "",
            publicId: user.publicId ?? "",
            role: user.role ?? Role.EMPLOYEE,
        },
    })

    /**
     * User data change after dialog open
     */
    useEffect(() => {
        if (!open) return

        form.reset({
            name: user.name,
            email: user.email,
            phone: user.phone ?? "",
            avatar: user.avatar ?? "",
            publicId: user.publicId ?? "",
            role: user.role ?? Role.EMPLOYEE,
        })
    }, [user, open, form])

    const onSubmit = async (values: UserFormValues) => {
        try {
            await updateUser({
                userId: user.id,
                data: {
                    name: values.name || null,
                    email: values.email,
                    phone: values.phone || null,
                    avatar: values.avatar || null,
                    publicId: values.publicId || null,
                    role: values.role,
                },
            }).unwrap()

            toast.success("User updated successfully")

            onOpenChange(false)
        } catch (error) {
            console.error("Failed to update user:", error)

            toast.error(
                getErrorMessage(error) || "Failed to update user. Please try again."
            )
        }
    }

    const isSubmitting = isUpdating

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>

                    <DialogDescription>
                        Update the user's account information.
                    </DialogDescription>
                </DialogHeader>

                <form id="edit-user-form" onSubmit={form.handleSubmit(onSubmit)}>
                    <UserForm
                        form={form}
                        isSubmitting={isSubmitting}
                    />
                </form>

                <DialogFooter className="flex-row justify-end">
                    <span className="hidden sm:flex flex-1 text-sm text-muted-foreground">
                        Some changes may require the user to log in again to take effect.
                    </span>

                    <Button
                        type="button"
                        variant="outline"
                        disabled={isSubmitting}
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        form="edit-user-form"
                        disabled={isSubmitting}
                    >
                        {isUpdating ? (
                            <>
                                <Loader2 className="animate-spin" />
                                Updating...
                            </>
                        ) : (
                            "Update"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
