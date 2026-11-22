"use client"

import { useEffect, useState } from "react"
import { Plus, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

import type {
  ShippingZone,
  ShippingZonePayload,
} from "../../types/shipping-settings.types"

interface ShippingZoneFormDialogProps {
  open: boolean
  zone: ShippingZone | null
  isSubmitting: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: ShippingZonePayload) => Promise<void>
}

export function ShippingZoneFormDialog({
  open,
  zone,
  isSubmitting,
  onOpenChange,
  onSubmit,
}: ShippingZoneFormDialogProps) {
  const [districtCity, setDistrictCity] = useState("")
  const [rate, setRate] = useState("")
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (!open) return
    const frame = requestAnimationFrame(() => {
      setDistrictCity(zone?.districtCity ?? "")
      setRate(zone?.rate ?? "")
      setIsActive(zone?.isActive ?? true)
    })
    return () => cancelAnimationFrame(frame)
  }, [open, zone])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onSubmit({
      districtCity: districtCity.trim(),
      rate: Number(rate),
      isActive,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {zone ? "Update shipping zone" : "Create shipping zone"}
          </DialogTitle>
          <DialogDescription>
            Configure the delivery area, flat delivery fee and availability.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="shipping-district-city">District / city name <span className="text-destructive">*</span></Label>
            <Input
              id="shipping-district-city"
              value={districtCity}
              onChange={(event) => setDistrictCity(event.target.value)}
              placeholder="e.g. Dhaka"
              minLength={2}
              maxLength={100}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shipping-rate">Flat rate (৳) <span className="text-destructive">*</span></Label>
            <Input
              id="shipping-rate"
              type="number"
              min="0"
              step="0.01"
              value={rate}
              onChange={(event) => setRate(event.target.value)}
              placeholder="0.00"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center justify-between rounded-sm border border-border/70 bg-muted/20 p-3">
            <div className="space-y-0.5">
              <Label htmlFor="shipping-zone-active">Zone availability</Label>
              <p className="text-xs text-muted-foreground">
                Inactive zones are retained but marked unavailable.
              </p>
            </div>
            <Switch
              id="shipping-zone-active"
              checked={isActive}
              onCheckedChange={setIsActive}
              disabled={isSubmitting}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {zone ? <Save className="size-4" /> : <Plus className="size-4" />}
              {isSubmitting
                ? "Saving..."
                : zone
                  ? "Update zone"
                  : "Create zone"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
