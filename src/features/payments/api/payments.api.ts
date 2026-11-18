import { baseApi } from "@/lib/api/base-api"

import type {
  Payment,
  PaymentQueryParams,
  PaymentsResponse,
} from "../types/payment.types"

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query<PaymentsResponse, PaymentQueryParams | void>({
      query: (params) => ({
        url: "/payments",
        method: "GET",
        ...(params && { params }),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Payment" as const,
                id,
              })),
              { type: "Payment" as const, id: "LIST" },
            ]
          : [{ type: "Payment" as const, id: "LIST" }],
    }),
    getPayment: builder.query<Payment, string>({
      query: (id) => ({ url: `/payments/${id}`, method: "GET" }),
      providesTags: (_result, _error, id) => [{ type: "Payment", id }],
    }),
  }),
})

export const { useGetPaymentsQuery, useGetPaymentQuery } = paymentsApi
