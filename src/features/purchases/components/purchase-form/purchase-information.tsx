"use client"

import { Controller, type Control } from "react-hook-form"
import { Check, ChevronsUpDown, Store } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

import type { PurchaseFormValues } from "../../schemas/purchase.schema"

interface Supplier {
  id: string
  name: string
  isActive?: boolean
}

interface PurchaseInformationProps {
  control: Control<PurchaseFormValues>
  suppliers: Supplier[]
  isLoading: boolean
}

/** Renders supplier selection and explains the purchase source. */
export function PurchaseInformation({
  control,
  suppliers,
  isLoading,
}: PurchaseInformationProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/20">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-background">
            <Store className="size-5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-base">Supplier information</CardTitle>
            <CardDescription>
              Choose who you are purchasing these products from.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-5">
        <Controller
          control={control}
          name="supplierId"
          render={({ field, fieldState }) => {
            const selectedSupplier = suppliers.find(
              (supplier) => supplier.id === field.value
            )

            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  Supplier <span className="text-destructive">*</span>
                </FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      disabled={isLoading}
                      aria-invalid={fieldState.invalid}
                      className="h-11 w-full justify-between font-normal"
                    >
                      <span className="truncate">
                        {selectedSupplier?.name ?? "Select a supplier"}
                      </span>
                      <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent
                    align="start"
                    className="w-(--radix-popover-trigger-width) p-0"
                  >
                    <Command>
                      <CommandInput placeholder="Search suppliers..." />
                      <CommandList>
                        <CommandEmpty>No supplier found.</CommandEmpty>
                        <CommandGroup>
                          {suppliers
                            .filter((supplier) => supplier.isActive !== false)
                            .map((supplier) => (
                              <CommandItem
                                key={supplier.id}
                                value={supplier.name}
                                onSelect={() => field.onChange(supplier.id)}
                              >
                                <span className="truncate">
                                  {supplier.name}
                                </span>
                                <Check
                                  className={cn(
                                    "ml-auto size-4",
                                    field.value === supplier.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
                <p className="text-xs text-muted-foreground">
                  The selected supplier will be linked to this purchase record.
                </p>
              </Field>
            )
          }}
        />
      </CardContent>
    </Card>
  )
}
