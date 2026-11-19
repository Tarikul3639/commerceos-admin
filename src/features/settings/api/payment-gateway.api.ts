import { baseApi } from "@/lib/api/base-api"

import type {
  PaymentGateway,
  CreatePaymentGatewayRequest,
  UpdatePaymentGatewayRequest,
} from "../types/payment-gateway.types"

const PAYMENT_GATEWAY_URL = "/settings/payment-gateway"

export const paymentGatewayApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all gateway configurations
    getPaymentGateways: builder.query<PaymentGateway[], void>({
      query: () => ({
        url: PAYMENT_GATEWAY_URL,
        method: "GET",
      }),
      providesTags: (result) => [
        { type: "PaymentGateway", id: "LIST" },
        ...(result ?? []).map(({ id }) => ({
          type: "PaymentGateway" as const,
          id,
        })),
      ],
    }),

    // Get gateway configuration by ID
    getPaymentGatewayById: builder.query<PaymentGateway, string>({
      query: (id) => ({
        url: `${PAYMENT_GATEWAY_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "PaymentGateway", id }],
    }),

    // Create gateway configuration
    createPaymentGateway: builder.mutation<
      PaymentGateway,
      CreatePaymentGatewayRequest
    >({
      query: (body) => ({
        url: PAYMENT_GATEWAY_URL,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "PaymentGateway", id: "LIST" }],
    }),

    // Update gateway configuration
    updatePaymentGateway: builder.mutation<
      PaymentGateway,
      { id: string; body: UpdatePaymentGatewayRequest }
    >({
      query: ({ id, body }) => ({
        url: `${PAYMENT_GATEWAY_URL}/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "PaymentGateway", id },
        { type: "PaymentGateway", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetPaymentGatewaysQuery,
  useGetPaymentGatewayByIdQuery,
  useCreatePaymentGatewayMutation,
  useUpdatePaymentGatewayMutation,
} = paymentGatewayApi
