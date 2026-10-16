import { baseApi } from "@/lib/api/base-api"

import type {
    PaymentGatewayConfig,
    CreatePaymentGatewayConfigRequest,
    UpdatePaymentGatewayConfigRequest,
} from "../types/payment-gateway-config.types"

const PAYMENT_GATEWAY_CONFIG_URL = "/payment-gateway-config"

export const paymentGatewayConfigApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get all gateway configurations
        getPaymentGatewayConfigs: builder.query<PaymentGatewayConfig[], void>({
            query: () => ({
                url: PAYMENT_GATEWAY_CONFIG_URL,
                method: "GET",
            }),
            providesTags: (result) => [
                { type: "PaymentGatewayConfig", id: "LIST" },
                ...(result ?? []).map(({ id }) => ({
                    type: "PaymentGatewayConfig" as const,
                    id,
                })),
            ],
        }),

        // Get gateway configuration by ID
        getPaymentGatewayConfigById: builder.query<PaymentGatewayConfig, string>({
            query: (id) => ({
                url: `${PAYMENT_GATEWAY_CONFIG_URL}/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [
                { type: "PaymentGatewayConfig", id },
            ],
        }),

        // Create gateway configuration
        createPaymentGatewayConfig: builder.mutation<
            PaymentGatewayConfig,
            CreatePaymentGatewayConfigRequest
        >({
            query: (body) => ({
                url: PAYMENT_GATEWAY_CONFIG_URL,
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "PaymentGatewayConfig", id: "LIST" }],
        }),

        // Update gateway configuration
        updatePaymentGatewayConfig: builder.mutation<
            PaymentGatewayConfig,
            { id: string; body: UpdatePaymentGatewayConfigRequest }
        >({
            query: ({ id, body }) => ({
                url: `${PAYMENT_GATEWAY_CONFIG_URL}/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "PaymentGatewayConfig", id },
                { type: "PaymentGatewayConfig", id: "LIST" },
            ],
        }),
    }),
    overrideExisting: false,
})

export const {
    useGetPaymentGatewayConfigsQuery,
    useGetPaymentGatewayConfigByIdQuery,
    useCreatePaymentGatewayConfigMutation,
    useUpdatePaymentGatewayConfigMutation,
} = paymentGatewayConfigApi
