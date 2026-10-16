"use client"

import { useState } from "react"
import { KeyRound, Plus, RefreshCw } from "lucide-react"
import { toast } from "sonner"

import { PageContainer } from "@/components/layout/page-container"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

import {
    useCreatePaymentGatewayConfigMutation,
    useGetPaymentGatewayConfigsQuery,
    useUpdatePaymentGatewayConfigMutation,
} from "../../api/payment-gateway-config.api"
import type {
    CreatePaymentGatewayConfigRequest,
    PaymentGatewayConfig,
    UpdatePaymentGatewayConfigRequest,
} from "../../types/payment-gateway-config.types"

import { PaymentGatewayFormDialog } from "./payment-gateway-form-dialog"
import { PaymentGatewayList } from "./payment-gateway-list"
import { PaymentMethodsOverview } from "./payment-methods-overview"

const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Settings", href: "/dashboard/settings" },
    { label: "Payments" },
]

export function PaymentSettingsContent() {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingConfig, setEditingConfig] =
        useState<PaymentGatewayConfig | null>(null)
    const [togglingId, setTogglingId] = useState<string | null>(null)

    const {
        data: configs = [],
        isLoading,
        isFetching,
        error,
        refetch,
    } = useGetPaymentGatewayConfigsQuery()

    const [createConfig, { isLoading: isCreating }] =
        useCreatePaymentGatewayConfigMutation()

    const [updateConfig, { isLoading: isUpdating }] =
        useUpdatePaymentGatewayConfigMutation()

    const enabledCount = configs.filter((c) => c.isEnabled).length
    const liveCount = configs.filter((c) => c.mode === "LIVE").length

    async function handleCreate(values: CreatePaymentGatewayConfigRequest) {
        await createConfig(values).unwrap()
        setDialogOpen(false)
    }

    async function handleUpdate(
        id: string,
        values: UpdatePaymentGatewayConfigRequest,
    ) {
        await updateConfig({ id, body: values }).unwrap()
        setDialogOpen(false)
        setEditingConfig(null)
    }

    // Quick toggle from the card: locks only that card, never touches the dialog.
    async function handleToggle(config: PaymentGatewayConfig) {
        const next = !config.isEnabled
        setTogglingId(config.id)
        try {
            await updateConfig({
                id: config.id,
                body: { isEnabled: next },
            }).unwrap()
            toast.success(
                `${config.displayName} ${next ? "enabled" : "disabled"}`,
            )
        } catch {
            toast.error(`Could not update ${config.displayName}`)
        } finally {
            setTogglingId(null)
        }
    }

    function handleEdit(config: PaymentGatewayConfig) {
        setEditingConfig(config)
        setDialogOpen(true)
    }

    function handleAdd() {
        setEditingConfig(null)
        setDialogOpen(true)
    }

    return (
        <PageContainer
            title="Payment Settings"
            breadcrumbs={breadcrumbs}
            pageHeaderAction={
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => void refetch()}
                        disabled={isFetching}
                        aria-label="Refresh gateways"
                    >
                        <RefreshCw className={cn(isFetching && "animate-spin")} />
                        <span className="hidden sm:inline">Refresh</span>
                    </Button>

                    <Button onClick={handleAdd} size="sm">
                        <Plus />
                        <span className="hidden sm:inline">Add gateway</span>
                        <span className="sm:hidden">Add</span>
                    </Button>
                </div>
            }
        >
            <div className="mx-auto w-full max-w-6xl space-y-6">
                {isLoading ? (
                    <Skeleton className="h-28 rounded-xl sm:h-24" />
                ) : (
                    <PaymentMethodsOverview
                        total={configs.length}
                        enabled={enabledCount}
                        live={liveCount}
                    />
                )}

                {error && (
                    <Alert variant="destructive">
                        <AlertTitle>Could not load gateways</AlertTitle>
                        <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
                            <span>
                                Payment gateway configurations failed to load.
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => void refetch()}
                                disabled={isFetching}
                            >
                                Try again
                            </Button>
                        </AlertDescription>
                    </Alert>
                )}

                <section className="space-y-3">
                    <div>
                        <h2 className="text-sm font-semibold">Gateways</h2>
                        <p className="text-xs text-muted-foreground">
                            Choose which providers customers see at checkout.
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <Skeleton key={index} className="h-36 rounded-xl" />
                            ))}
                        </div>
                    ) : (
                        <div
                            className={cn(
                                "transition-opacity",
                                isFetching && "opacity-70",
                            )}
                        >
                            <PaymentGatewayList
                                configs={configs}
                                onEdit={handleEdit}
                                onToggle={(config) => void handleToggle(config)}
                                onAdd={handleAdd}
                                updatingId={togglingId}
                            />
                        </div>
                    )}
                </section>

                <Alert>
                    <KeyRound className="size-4" />
                    <AlertTitle>Gateway credentials</AlertTitle>
                    <AlertDescription className="text-xs leading-relaxed">
                        Configure API keys and private credentials using your
                        server-side environment variables or secret manager. Do not
                        store secret keys in the public settings response.
                    </AlertDescription>
                </Alert>

                <PaymentGatewayFormDialog
                    open={dialogOpen}
                    onOpenChange={(open) => {
                        setDialogOpen(open)
                        if (!open) setEditingConfig(null)
                    }}
                    config={editingConfig}
                    onCreate={handleCreate}
                    onUpdate={handleUpdate}
                    isSubmitting={isCreating || (isUpdating && togglingId === null)}
                />
            </div>
        </PageContainer>
    )
}