"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import type { Supplier } from "../types/supplier.types"
import {
  supplierSchema,
  type SupplierFormValues,
} from "../schemas/supplier.schema"

export function SupplierForm({
  supplier,
  onSubmit,
  onCancel,
  isLoading = false,
}: {
  supplier?: Supplier | null
  onSubmit: (data: SupplierFormValues) => void | Promise<void>
  onCancel: () => void
  isLoading?: boolean
}) {
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: supplier?.name ?? "",
      email: supplier?.email ?? "",
      phone: supplier?.phone ?? "",
      address: supplier?.address ?? "",
      contactPerson: supplier?.contactPerson ?? "",
      isActive: supplier?.isActive ?? true,
    },
  })
  const fields = [
    ["name", "Name", "ABC Trading", "text"],
    ["email", "Email", "contact@example.com", "email"],
    ["phone", "Phone", "+8801712345678", "tel"],
    ["contactPerson", "Contact person", "John Doe", "text"],
  ] as const
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup className="grid gap-4 sm:grid-cols-2">
        {fields.map(([name, label, placeholder, type]) => (
          <Controller
            key={name}
            control={form.control}
            name={name}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`supplier-${name}`}>{label}</FieldLabel>
                <Input
                  {...field}
                  id={`supplier-${name}`}
                  type={type}
                  placeholder={placeholder}
                  disabled={isLoading}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        ))}
        <Controller
          control={form.control}
          name="address"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="sm:col-span-2">
              <FieldLabel htmlFor="supplier-address">Address</FieldLabel>
              <Textarea
                {...field}
                id="supplier-address"
                rows={3}
                maxLength={500}
                disabled={isLoading}
                className="resize-none"
                aria-invalid={fieldState.invalid}
                placeholder="e.g. 123 Main St, City, Country"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {supplier && (
          <Controller
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <Field orientation="horizontal" className="sm:col-span-2">
                <FieldLabel htmlFor="supplier-active">Active</FieldLabel>
                <Switch
                  id="supplier-active"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </Field>
            )}
          />
        )}
      </FieldGroup>
      <div className="flex justify-end gap-2 border-t pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : supplier ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  )
}
