import { CreditCard, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

import type { PaymentGateway } from "../../types/payment-gateway.types"
import { PaymentGatewayCard } from "./payment-gateway-card"

interface PaymentGatewayListProps {
  configs: PaymentGateway[]
  onEdit: (config: PaymentGateway) => void
  onToggle: (config: PaymentGateway) => void
  onAdd: () => void
  /** id of the gateway currently being toggled (only that card is locked) */
  updatingId: string | null
  canUpdate: boolean
}

export function PaymentGatewayList({
  configs,
  onEdit,
  onToggle,
  onAdd,
  updatingId,
  canUpdate,
}: PaymentGatewayListProps) {
  if (configs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <CreditCard className="size-6 text-muted-foreground" />
        </div>

        <h3 className="mt-4 text-sm font-semibold">No gateways configured</h3>

        <p className="mt-1 max-w-sm text-xs text-muted-foreground">
          Add a payment gateway to control which payment methods customers can
          use at checkout.
        </p>

        {canUpdate && (
          <Button size="sm" className="mt-5 gap-1.5" onClick={onAdd}>
            <Plus className="size-4" />
            Add gateway
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {configs.map((config) => (
        <PaymentGatewayCard
          key={config.id}
          config={config}
          onEdit={() => onEdit(config)}
          onToggle={() => onToggle(config)}
          isUpdating={updatingId === config.id}
          canUpdate={canUpdate}
        />
      ))}
    </div>
  )
}
