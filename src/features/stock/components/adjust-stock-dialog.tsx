"use client"

import { useEffect } from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { getErrorMessage } from "@/lib/utils/error"

import { useAdjustStockMutation } from "../api/stock.api"
import { stockFormSchema } from "../schemas/stock.schema"
import type { Stock } from "../types/stock.types"

interface AdjustStockDialogProps {
  stock: Stock | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

type StockFormValues = z.infer<typeof stockFormSchema>

export function AdjustStockDialog({
  stock,
  open,
  onOpenChange,
}: AdjustStockDialogProps) {
  const [adjustStock, { isLoading }] = useAdjustStockMutation()

  const form = useForm<StockFormValues>({
    resolver: zodResolver(stockFormSchema),
    defaultValues: {
      quantity: "",
      reason: "",
    },
  })

  const quantity = Number(form.watch("quantity") || 0)
  const finalStock = (stock?.quantity ?? 0) + quantity

  useEffect(() => {
    if (open) {
      form.reset({
        quantity: stock ? String(stock.quantity) : "",
        reason: "",
      })
    }
  }, [open, stock, form])

  const submit = async (values: StockFormValues) => {
    if (!stock) return

    const adjustment = Number(values.quantity)
    const finalStock = stock.quantity + adjustment

    if (finalStock < 0) {
      form.setError("quantity", {
        message: "Final stock cannot be negative.",
      })
      return
    }

    try {
      await adjustStock({
        productId: stock.productId,
        quantity: adjustment,
        ...(values.reason?.trim() && {
          reason: values.reason.trim(),
        }),
      }).unwrap()

      toast.success("Stock adjusted successfully")
      onOpenChange(false)
      form.reset()
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to adjust stock")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust stock</DialogTitle>

          <DialogDescription>
            {stock ? (
              <>
                {stock.productName} · Current stock:{" "}
                <span className="text-primary">{stock.quantity}</span>
              </>
            ) : (
              "Update the product stock quantity."
            )}{" "}
            Use a positive number to add stock or a negative number to remove
            it.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
          <Field data-invalid={!!form.formState.errors.quantity}>
            <FieldLabel htmlFor="stock-adjustment-quantity">
              Quantity adjustment
            </FieldLabel>

            <Input
              id="stock-adjustment-quantity"
              type="number"
              step="1"
              {...form.register("quantity")}
              placeholder="e.g. 10 or -2"
              disabled={isLoading}
            />

            <div className="text-xs text-muted-foreground">
              Final stock:{" "}
              <span className="font-medium text-primary">{finalStock}</span>
            </div>

            {form.formState.errors.quantity && (
              <FieldError>{form.formState.errors.quantity.message}</FieldError>
            )}
          </Field>

          <Field data-invalid={!!form.formState.errors.reason}>
            <FieldLabel htmlFor="stock-adjustment-reason">
              Reason <span className="text-muted-foreground">(optional)</span>
            </FieldLabel>

            <Input
              id="stock-adjustment-reason"
              {...form.register("reason")}
              placeholder="e.g. Physical stock count correction"
              disabled={isLoading}
            />

            {form.formState.errors.reason && (
              <FieldError>{form.formState.errors.reason.message}</FieldError>
            )}
          </Field>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isLoading || !stock}>
              {isLoading ? "Saving..." : "Adjust stock"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
