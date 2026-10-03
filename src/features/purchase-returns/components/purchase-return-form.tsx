"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { createColumnHelper } from "@tanstack/react-table"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { toast } from "sonner"

import type { DataTableFeatures } from "@/components/data-table"
import { DataTable } from "@/components/data-table"
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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Permission } from "@/config/permissions.config"
import { usePermission } from "@/hooks/use-permission"
import { formatCurrency } from "@/lib/utils/format-currency"
import { cn } from "@/lib/utils"
import {
  useGetPurchaseQuery,
  useGetPurchasesQuery,
} from "@/features/purchases/api/purchase.api"
import type {
  Purchase,
  PurchaseItem,
} from "@/features/purchases/types/purchase.types"
import {
  useCreatePurchaseReturnMutation,
  useGetPurchaseReturnsQuery,
} from "../api/purchase-return.api"
import {
  purchaseReturnSchema,
  type PurchaseReturnFormValues,
} from "../schemas/purchase-return.schema"

const itemHelper = createColumnHelper<DataTableFeatures, PurchaseItem>()

interface PurchaseReturnFormProps {
  initialPurchaseId?: string
}

export function PurchaseReturnForm({
  initialPurchaseId,
}: PurchaseReturnFormProps) {
  const router = useRouter()
  const permission = usePermission()
  const [purchaseSearch, setPurchaseSearch] = useState("")
  const [purchaseId, setPurchaseId] = useState(initialPurchaseId ?? "")
  const { data: purchaseResults, isLoading: purchasesLoading } =
    useGetPurchasesQuery({
      search: purchaseSearch || undefined,
      status: "RECEIVED",
      page: 1,
      limit: 100,
    })
  const { currentData: purchase, isLoading: purchaseLoading } =
    useGetPurchaseQuery(purchaseId, { skip: !purchaseId })
  const { currentData: previousReturns, isLoading: returnsLoading } =
    useGetPurchaseReturnsQuery(
      { purchaseId, page: 1, limit: 100 },
      { skip: !purchaseId }
    )
  const [createReturn, { isLoading: isSubmitting }] =
    useCreatePurchaseReturnMutation()

  const returnedByPurchaseItem = useMemo(() => {
    const totals = new Map<string, number>()
    for (const returnRecord of previousReturns?.data ?? []) {
      if (
        returnRecord.status !== "APPROVED" &&
        returnRecord.status !== "COMPLETED"
      ) {
        continue
      }
      for (const item of returnRecord.items) {
        const itemId = item.purchaseItemId ?? item.purchaseItem.id
        totals.set(itemId, (totals.get(itemId) ?? 0) + item.quantity)
      }
    }
    return totals
  }, [previousReturns])

  const form = useForm<PurchaseReturnFormValues>({
    resolver: zodResolver(purchaseReturnSchema),
    defaultValues: {
      purchaseId: initialPurchaseId ?? "",
      reason: "",
      items: [],
    },
  })
  const values = form.watch()

  useEffect(() => {
    if (!purchase || returnsLoading) return
    form.reset({
      purchaseId: purchase.id,
      reason: "",
      items: purchase.items.map((item) => ({
        purchaseItemId: item.id,
        quantity: 0,
        reason: "",
      })),
    })
  }, [purchase, returnsLoading, returnedByPurchaseItem, form])

  const remainingFor = (item: PurchaseItem) =>
    Math.max(item.quantity - (returnedByPurchaseItem.get(item.id) ?? 0), 0)

  const columns = useMemo(
    () =>
      itemHelper.columns([
        {
          accessorKey: "product.name",
          header: "Product",
          cell: ({ row }) => (
            <div className="min-w-0">
              <p className="truncate font-medium">
                {row.original.product.name}
              </p>
              <p className="font-mono text-xs text-muted-foreground">
                {row.original.product.sku}
              </p>
            </div>
          ),
        },
        {
          accessorKey: "quantity",
          header: "Purchased",
          cell: ({ row }) => row.original.quantity,
        },
        {
          id: "returnQuantity",
          header: "Return qty",
          cell: ({ row }) => {
            const index = row.index
            const max = remainingFor(row.original)
            return (
              <Controller
                control={form.control}
                name={`items.${index}.quantity`}
                render={({ field, fieldState }) => (
                  <div className="w-24">
                    <Input
                      {...field}
                      type="number"
                      min={0}
                      max={max}
                      step={1}
                      disabled={isSubmitting || max === 0}
                      aria-label={`Return quantity for ${row.original.product.name}`}
                      aria-invalid={fieldState.invalid}
                      onChange={(event) =>
                        field.onChange(event.target.valueAsNumber || 0)
                      }
                    />
                    <span className="mt-1 block text-[11px] text-muted-foreground">
                      Max {max}
                    </span>
                  </div>
                )}
              />
            )
          },
        },
        {
          accessorKey: "unitPrice",
          header: "Unit price",
          cell: ({ row }) =>
            formatCurrency(row.original.unitPrice, { compact: false }),
        },
        {
          id: "subtotal",
          header: "Subtotal",
          cell: ({ row }) =>
            formatCurrency(
              Number(row.original.unitPrice) *
                Number(values.items[row.index]?.quantity || 0),
              { compact: false }
            ),
        },
        {
          id: "reason",
          header: "Item reason",
          cell: ({ row }) => (
            <Controller
              control={form.control}
              name={`items.${row.index}.reason`}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Optional"
                  className="min-w-36"
                  disabled={isSubmitting}
                />
              )}
            />
          ),
        },
      ]),
    [form.control, isSubmitting, returnedByPurchaseItem, values.items]
  )

  const subtotal = (purchase?.items ?? []).reduce(
    (sum, item, index) =>
      sum + Number(item.unitPrice) * Number(values.items[index]?.quantity || 0),
    0
  )

  const submit = async (data: PurchaseReturnFormValues) => {
    if (!permission.has(Permission.PURCHASE_CREATE)) return
    if (!purchase || purchase.status !== "RECEIVED") {
      form.setError("purchaseId", {
        message: "Only received purchases can be returned",
      })
      return
    }
    const items = data.items.filter((item) => item.quantity > 0)
    if (!items.length) {
      form.setError("items", { message: "Select at least one item to return" })
      return
    }
    for (const item of items) {
      const source = purchase.items.find(
        (purchaseItem) => purchaseItem.id === item.purchaseItemId
      )
      if (!source || item.quantity > remainingFor(source)) {
        form.setError("items", {
          message:
            "Return quantities cannot exceed the remaining purchased quantity",
        })
        return
      }
    }
    try {
      const result = await createReturn({
        purchaseId: data.purchaseId,
        ...(data.reason?.trim() && { reason: data.reason.trim() }),
        items: items.map((item) => ({
          purchaseItemId: item.purchaseItemId,
          quantity: item.quantity,
          ...(item.reason?.trim() && { reason: item.reason.trim() }),
        })),
      }).unwrap()
      toast.success("Purchase return created successfully")
      router.push(`/dashboard/purchase-returns/${result.id}`)
    } catch (error) {
      toast.error("Unable to create purchase return", {
        description:
          (
            error as { data?: { message?: string | string[] } }
          )?.data?.message?.toString() ?? "Please try again.",
      })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Original purchase</CardTitle>
          <CardDescription>
            Choose a received purchase to select its return items.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGroup>
            <Controller
              control={form.control}
              name="purchaseId"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Purchase</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between font-normal"
                        disabled={isSubmitting}
                        aria-invalid={fieldState.invalid}
                      >
                        {purchase?.invoiceNo ?? "Choose a received purchase"}
                        <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="w-[--radix-popover-trigger-width] p-0"
                    >
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Search invoices or suppliers..."
                          value={purchaseSearch}
                          onValueChange={setPurchaseSearch}
                        />
                        <CommandList>
                          <CommandEmpty>
                            {purchasesLoading
                              ? "Loading purchases..."
                              : "No received purchases found."}
                          </CommandEmpty>
                          <CommandGroup>
                            {(purchaseResults?.data ?? []).map((option) => (
                              <CommandItem
                                key={option.id}
                                value={option.id}
                                onSelect={() => {
                                  field.onChange(option.id)
                                  setPurchaseId(option.id)
                                }}
                              >
                                {option.invoiceNo} · {option.supplier.name}
                                <Check
                                  className={cn(
                                    "ml-auto size-4",
                                    field.value === option.id
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
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="reason"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Return reason</FieldLabel>
                  <Textarea
                    {...field}
                    rows={3}
                    placeholder="Optional reason for this return"
                    disabled={isSubmitting}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>
      </Card>

      {purchaseId && (
        <DataTable
          title="Return items"
          description={
            purchase
              ? `Select quantities to return from ${purchase.invoiceNo}.`
              : "Loading source purchase items..."
          }
          data={purchase?.items ?? []}
          columns={columns}
          isLoading={purchaseLoading || returnsLoading}
          showPagination={false}
          initialColumnVisibility={{
            pagination: false,
            sorting: false,
            filtering: false,
            columnVisibility: false,
            rowSelection: false,
          }}
        />
      )}
      {form.formState.errors.items?.message && (
        <p className="text-sm text-destructive">
          {form.formState.errors.items.message}
        </p>
      )}
      {purchase && (
        <div className="flex justify-end">
          <Card className="w-full py-2 sm:max-w-xs">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between font-medium">
                <span>Return total</span>
                <span>{formatCurrency(subtotal, { compact: false })}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      <div className="flex justify-end gap-2 border-t pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/purchase-returns")}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={
            isSubmitting ||
            !permission.has(Permission.PURCHASE_CREATE) ||
            !purchase ||
            purchase.status !== "RECEIVED"
          }
        >
          {isSubmitting ? "Creating..." : "Create return"}
        </Button>
      </div>
    </form>
  )
}
