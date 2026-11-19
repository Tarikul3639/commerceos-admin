export type PaymentProvider =
  "MANUAL" | "STRIPE" | "SSL_COMMERZ" | "BKASH" | "NAGAD" | "ROCKET"

export type PaymentGatewayMode = "TEST" | "LIVE"

export interface PaymentGateway {
  id: string
  provider: PaymentProvider
  displayName: string
  isEnabled: boolean
  mode: PaymentGatewayMode
  settings: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
}

export interface CreatePaymentGatewayRequest {
  provider: PaymentProvider
  displayName: string
  isEnabled?: boolean
  mode?: PaymentGatewayMode
  settings?: Record<string, unknown>
}

export type UpdatePaymentGatewayRequest = Partial<CreatePaymentGatewayRequest>

export interface PaymentGatewayResponse {
  data: PaymentGateway
}

export interface PaymentGatewaysResponse {
  data: PaymentGateway[]
}
