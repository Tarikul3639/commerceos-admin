"use client"

import type { UseFormReturn } from "react-hook-form"

import { Input } from "@/components/ui/input"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectGroup,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Role } from "@/config/roles.config"
import { type UserFormValues } from "../schemas/user.schema"

import { UserAvatarUpload } from "./user-avatar-upload"

interface UserFormProps {
    form: UseFormReturn<UserFormValues>
    isSubmitting?: boolean
}

export function UserForm({
    form,
    isSubmitting = false,
}: UserFormProps) {
    const avatar = form.watch("avatar")
    const role = form.watch("role")
    const roleOptions = Object.values(Role)

    return (
        <FieldGroup>
            {/* Avatar */}
            <UserAvatarUpload
                value={avatar ?? ""}
                onChange={({ url, publicId }) => {
                    form.setValue("avatar", url, {
                        shouldDirty: true,
                        shouldValidate: true,
                    })

                    form.setValue("publicId", publicId, {
                        shouldDirty: true,
                        shouldValidate: true,
                    })
                }}
                disabled={isSubmitting}
            />

            {/* Name + Role */}
            <div className="flex flex-col gap-4 sm:flex-row">
                {/* Name */}
                <Field>
                    <FieldLabel htmlFor="name">Full Name</FieldLabel>

                    <Input
                        id="name"
                        placeholder="John Doe"
                        disabled={isSubmitting}
                        {...form.register("name")}
                    />

                    {form.formState.errors.name && (
                        <FieldError>{form.formState.errors.name.message}</FieldError>
                    )}
                </Field>

                {/* Role */}
                <Field className="w-full sm:w-38">
                    <FieldLabel htmlFor="role">Role</FieldLabel>

                    <Select
                        value={role ?? Role.EMPLOYEE}
                        onValueChange={(value) =>
                            form.setValue("role", value as Role, {
                                shouldValidate: true,
                                shouldDirty: true,
                            })
                        }
                        disabled={isSubmitting}
                    >
                        <SelectTrigger id="role" className="capitalize">
                            <SelectValue
                                placeholder="Select a role"
                            />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Roles</SelectLabel>

                                {roleOptions.map((roleOption) => (
                                    <SelectItem
                                        key={roleOption}
                                        value={roleOption}
                                        className="capitalize"
                                    >
                                        {roleOption.toLowerCase()}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    {form.formState.errors.role && (
                        <FieldError>{form.formState.errors.role.message}</FieldError>
                    )}
                </Field>
            </div>

            {/* Email */}
            <Field>
                <FieldLabel htmlFor="email">Email Address</FieldLabel>

                <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    disabled={isSubmitting}
                    {...form.register("email")}
                />

                {form.formState.errors.email && (
                    <FieldError>{form.formState.errors.email.message}</FieldError>
                )}
            </Field>

            {/* Phone */}
            <Field>
                <FieldLabel htmlFor="phone">Phone Number</FieldLabel>

                <Input
                    id="phone"
                    placeholder="+8801712345678"
                    disabled={isSubmitting}
                    {...form.register("phone")}
                />

                {form.formState.errors.phone && (
                    <FieldError>{form.formState.errors.phone.message}</FieldError>
                )}
            </Field>
        </FieldGroup>
    )
}
