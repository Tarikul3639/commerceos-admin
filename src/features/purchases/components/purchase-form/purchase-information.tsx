"use client"

import { Controller, type Control } from "react-hook-form"
import { Check, ChevronsUpDown } from "lucide-react"

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

export function PurchaseInformation({
  control,
  suppliers,
  isLoading,
}: PurchaseInformationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Purchase information</CardTitle>

        <CardDescription>
          Select the supplier for this purchase.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Controller
          control={control}
          name="supplierId"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Supplier</FieldLabel>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    disabled={isLoading}
                    aria-invalid={fieldState.invalid}
                    className="w-full justify-between font-normal"
                  >
                    <span className="truncate">
                      {field.value
                        ? (suppliers.find(
                            (supplier) => supplier.id === field.value
                          )?.name ?? "Choose a supplier")
                        : "Choose a supplier"}
                    </span>

                    <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
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
                              <span className="truncate">{supplier.name}</span>

                              <Check
                                className={cn(
                                  "ml-auto size-4 shrink-0",
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

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </CardContent>
    </Card>
  )
}
