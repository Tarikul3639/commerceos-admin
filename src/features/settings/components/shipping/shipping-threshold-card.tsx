import { Save, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ShippingThresholdCardProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  canUpdate: boolean
  isSaving: boolean
}

export function ShippingThresholdCard({
  value,
  onChange,
  onSubmit,
  canUpdate,
  isSaving,
}: ShippingThresholdCardProps) {
  return (
    <Card className="overflow-hidden border-border/70 shadow-sm">
      <CardHeader className="flex flex-row items-start gap-3 space-y-0">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/10">
          <Truck className="size-5" />
        </span>
        <div className="min-w-0 space-y-1">
          <CardTitle>Free shipping threshold</CardTitle>
          <CardDescription>
            Set the minimum order subtotal required to qualify for free
            delivery.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={onSubmit}
          className="flex w-full flex-col justify-between gap-3 sm:flex-row sm:items-end"
        >
          <div className="w-full max-w-sm space-y-2">
            <Label htmlFor="free-shipping-threshold">
              Minimum order amount (৳)
            </Label>
            <Input
              id="free-shipping-threshold"
              type="number"
              min="0"
              step="0.01"
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder="Disabled"
              disabled={!canUpdate || isSaving}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to disable the free-shipping threshold.
            </p>
          </div>
          {canUpdate && (
            <Button
              type="submit"
              className="w-fit self-end"
              disabled={isSaving}
            >
              <Save className="size-4" />
              {isSaving ? "Saving..." : "Save threshold"}
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
