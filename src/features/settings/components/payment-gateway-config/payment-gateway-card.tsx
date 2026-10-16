import { Loader2, PencilLine } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

import type { PaymentGatewayConfig } from "../../types/payment-gateway-config.types"
import { modeMeta, providerMeta } from "./payment-gateway-meta"

interface PaymentGatewayCardProps {
    config: PaymentGatewayConfig
    onEdit: () => void
    onToggle: () => void
    isUpdating: boolean
}

export function PaymentGatewayCard({
    config,
    onEdit,
    onToggle,
    isUpdating,
}: PaymentGatewayCardProps) {
    const meta = providerMeta[config.provider]
    const Icon = meta.icon
    const isLive = config.mode === "LIVE"

    return (
        <Card
            className={cn(
                "gap-0 overflow-hidden border py-0 shadow-sm transition-colors",
                config.isEnabled ? meta.cardBgClass : "opacity-70"
            )}
        >
            <CardContent className="flex flex-row items-start gap-4 p-5">
                <span
                    className={cn(
                        "flex size-12 shrink-0 items-center justify-center rounded-xl",
                        meta.iconBgClass
                    )}
                >
                    <Icon className={cn("size-6", meta.iconClass)} />
                </span>

                <div className="min-w-0 flex-1 pt-0.5">
                    <h3 className="truncate text-base leading-6 font-semibold">
                        {config.displayName}
                    </h3>

                    <p className="mt-0.5 truncate text-sm text-muted-foreground">
                        {meta.label}
                    </p>
                </div>

                <Badge
                    variant={config.isEnabled ? "default" : "secondary"}
                    className="shrink-0"
                >
                    {config.isEnabled ? "Enabled" : "Disabled"}
                </Badge>
            </CardContent>

            <div className="flex flex-wrap items-center gap-2 px-5 pb-5">
                <Badge variant="outline" className="gap-1.5">
                    <span
                        className={cn(
                            "size-1.5 rounded-full",
                            isLive ? "bg-emerald-500" : "bg-amber-500"
                        )}
                    />
                    {modeMeta[config.mode].label}
                </Badge>

                <span className="text-sm text-muted-foreground">
                    {modeMeta[config.mode].description}
                </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-3">
                <Label
                    htmlFor={`gateway-${config.id}`}
                    className="flex cursor-pointer items-center gap-2.5 text-xs text-muted-foreground"
                >
                    <Switch
                        id={`gateway-${config.id}`}
                        checked={config.isEnabled}
                        onCheckedChange={onToggle}
                        disabled={isUpdating}
                        aria-label={`Toggle ${config.displayName}`}
                    />

                    {isUpdating ? (
                        <span className="flex items-center gap-1.5">
                            <Loader2 className="size-4 animate-spin" />
                            Saving…
                        </span>
                    ) : (
                        "Available at checkout"
                    )}
                </Label>

                <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={onEdit}
                    disabled={isUpdating}
                >
                    Edit
                </Button>
            </div>
        </Card>
    )
}
