import { baseApi } from "@/lib/api/base-api"

import type {
  OrderReturn,
  OrderReturnQueryParams,
  OrderReturnsResponse,
} from "../types/return.types"

export const returnsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrderReturns: builder.query<
      OrderReturnsResponse,
      OrderReturnQueryParams | void
    >({
      query: (params) => ({
        url: "/order-returns",
        method: "GET",
        ...(params && { params }),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "OrderReturn" as const,
                id,
              })),
              { type: "OrderReturn" as const, id: "LIST" },
            ]
          : [{ type: "OrderReturn" as const, id: "LIST" }],
    }),
    getOrderReturn: builder.query<OrderReturn, string>({
      query: (id) => ({ url: `/order-returns/${id}`, method: "GET" }),
      providesTags: (_result, _error, id) => [{ type: "OrderReturn", id }],
    }),
    approveOrderReturn: builder.mutation<OrderReturn, string>({
      query: (id) => ({
        url: `/order-returns/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "OrderReturn", id },
        { type: "OrderReturn", id: "LIST" },
        "Stock",
      ],
    }),
    rejectOrderReturn: builder.mutation<
      OrderReturn,
      { id: string; reason: string }
    >({
      query: ({ id, reason }) => ({
        url: `/order-returns/${id}/reject`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "OrderReturn", id },
        { type: "OrderReturn", id: "LIST" },
      ],
    }),
    completeOrderReturn: builder.mutation<OrderReturn, string>({
      query: (id) => ({
        url: `/order-returns/${id}/complete`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "OrderReturn", id },
        { type: "OrderReturn", id: "LIST" },
        "Stock",
      ],
    }),
  }),
})

export const {
  useGetOrderReturnsQuery,
  useGetOrderReturnQuery,
  useApproveOrderReturnMutation,
  useRejectOrderReturnMutation,
  useCompleteOrderReturnMutation,
} = returnsApi
