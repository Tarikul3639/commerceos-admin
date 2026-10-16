export type PaymentProvider =
    "MANUAL" | "STRIPE" | "SSL_COMMERZ" | "BKASH" | "NAGAD" | "ROCKET"

export type PaymentGatewayMode = "TEST" | "LIVE"

export interface PaymentGatewayConfig {
    id: string
    provider: PaymentProvider
    displayName: string
    isEnabled: boolean
    mode: PaymentGatewayMode
    settings: Record<string, unknown> | null
    createdAt: string
    updatedAt: string
}

export interface CreatePaymentGatewayConfigRequest {
    provider: PaymentProvider
    displayName: string
    isEnabled?: boolean
    mode?: PaymentGatewayMode
    settings?: Record<string, unknown>
}

export type UpdatePaymentGatewayConfigRequest =
    Partial<CreatePaymentGatewayConfigRequest>

export interface PaymentGatewayConfigResponse {
    data: PaymentGatewayConfig
}

export interface PaymentGatewayConfigsResponse {
    data: PaymentGatewayConfig[]
}
