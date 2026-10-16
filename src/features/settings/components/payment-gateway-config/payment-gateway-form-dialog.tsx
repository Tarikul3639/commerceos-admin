"use client"

import { useEffect, useState } from "react"
import { Check, Loader2, TriangleAlert } from "lucide-react"
import { toast } from "sonner"

import { Alert, AlertDescription } from "@/components/ui/alert"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

import type {
    CreatePaymentGatewayConfigRequest,
    PaymentGatewayConfig,
    PaymentGatewayMode,
    PaymentProvider,
    UpdatePaymentGatewayConfigRequest,
} from "../../types/payment-gateway-config.types"
import { modeMeta, providerMeta, providerOptions } from "./payment-gateway-meta"

interface PaymentGatewayFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    config: PaymentGatewayConfig | null
    onCreate: (values: CreatePaymentGatewayConfigRequest) => Promise<void>
    onUpdate: (
        id: string,
        values: UpdatePaymentGatewayConfigRequest
    ) => Promise<void>
    isSubmitting: boolean
}

export function PaymentGatewayFormDialog({
    open,
    onOpenChange,
    config,
    onCreate,
    onUpdate,
    isSubmitting,
}: PaymentGatewayFormDialogProps) {
    const [provider, setProvider] = useState<PaymentProvider>("MANUAL")
    const [displayName, setDisplayName] = useState("")
    const [isEnabled, setIsEnabled] = useState(false)
    const [mode, setMode] = useState<PaymentGatewayMode>("TEST")

    useEffect(() => {
        if (!open) return

        setProvider(config?.provider ?? "MANUAL")
        setDisplayName(config?.displayName ?? "")
        setIsEnabled(config?.isEnabled ?? false)
        setMode(config?.mode ?? "TEST")
    }, [open, config])

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const values = {
            provider,
            displayName: displayName.trim(),
            isEnabled,
            mode,
        }

        if (!values.displayName) {
            toast.error("Display name is required")
            return
        }

        try {
            if (config) {
                await onUpdate(config.id, values)
                toast.success("Gateway configuration updated")
            } else {
                await onCreate(values)
                toast.success("Gateway configuration created")
            }
        } catch {
            toast.error("Could not save gateway configuration")
        }
    }

    const showLiveWarning = mode === "LIVE" && isEnabled

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[90dvh] flex-col overflow-hidden p-1 sm:w-full sm:max-w-md">
                <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
                    <DialogHeader className="shrink-0 gap-0.5 border-b px-5 py-4 pr-12 text-left">
                        <DialogTitle className="text-base">
                            {config ? "Edit payment gateway" : "Add payment gateway"}
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Configure provider availability and environment mode.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-5 py-4">
                        {/* Provider */}
                        <div className="space-y-1.5">
                            <Label htmlFor="gateway-provider">Provider</Label>
                            <Select
                                value={provider}
                                onValueChange={(value) => setProvider(value as PaymentProvider)}
                                disabled={!!config || isSubmitting}
                            >
                                <SelectTrigger id="gateway-provider" className="w-full">
                                    <span className="flex items-center gap-2">
                                        <SelectValue placeholder="Select provider" />
                                    </span>
                                </SelectTrigger>
                                <SelectContent>
                                    {providerOptions.map((item) => {
                                        const Icon = item.icon
                                        return (
                                            <SelectItem key={item.value} value={item.value}>
                                                <span className="flex items-center gap-2">
                                                    <Icon className="size-4 text-muted-foreground" />
                                                    {item.label}
                                                </span>
                                            </SelectItem>
                                        )
                                    })}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                                {config
                                    ? "Provider cannot be changed for an existing configuration."
                                    : providerMeta[provider].description}
                            </p>
                        </div>

                        {/* Display name */}
                        <div className="space-y-1.5">
                            <Label htmlFor="gateway-name">Display name</Label>
                            <Input
                                id="gateway-name"
                                value={displayName}
                                onChange={(event) => setDisplayName(event.target.value)}
                                placeholder="e.g. bKash Checkout"
                                maxLength={100}
                                required
                                disabled={isSubmitting}
                            />
                            <p className="text-right text-[11px] text-muted-foreground tabular-nums">
                                {displayName.length}/100
                            </p>
                        </div>

                        {/* Mode */}
                        <div className="space-y-1.5">
                            <Label id="gateway-mode-label">Environment mode</Label>
                            <div
                                role="radiogroup"
                                aria-labelledby="gateway-mode-label"
                                className="grid grid-cols-2 gap-2"
                            >
                                {(["TEST", "LIVE"] as const).map((item) => {
                                    const active = mode === item
                                    return (
                                        <button
                                            key={item}
                                            type="button"
                                            role="radio"
                                            aria-checked={active}
                                            disabled={isSubmitting}
                                            onClick={() => setMode(item)}
                                            className={cn(
                                                "rounded-lg border p-3 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50",
                                                active
                                                    ? "border-primary bg-primary/5"
                                                    : "hover:bg-muted/50"
                                            )}
                                        >
                                            <span className="flex items-center justify-between">
                                                <span className="text-sm font-medium">
                                                    {modeMeta[item].label}
                                                </span>
                                                {active && <Check className="size-4 text-primary" />}
                                            </span>
                                            <span className="mt-0.5 block text-xs text-muted-foreground">
                                                {modeMeta[item].description}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Enabled */}
                        <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
                            <div className="min-w-0">
                                <Label htmlFor="gateway-enabled">Enable gateway</Label>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    Allow this provider to be used at checkout.
                                </p>
                            </div>
                            <Switch
                                id="gateway-enabled"
                                checked={isEnabled}
                                onCheckedChange={setIsEnabled}
                                disabled={isSubmitting}
                            />
                        </div>

                        {showLiveWarning && (
                            <Alert>
                                <TriangleAlert className="size-4" />
                                <AlertDescription className="text-xs">
                                    This gateway will accept real payments from customers.
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <DialogFooter className="flex flex-row justify-end border-t px-5 py-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !displayName.trim()}
                            className="gap-2"
                        >
                            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                            {isSubmitting
                                ? "Saving..."
                                : config
                                    ? "Save changes"
                                    : "Create gateway"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
