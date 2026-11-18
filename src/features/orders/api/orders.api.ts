import { baseApi } from "@/lib/api/base-api"

import type {
  Order,
  OrderQueryParams,
  OrdersResponse,
  UpdateOrderStatusRequest,
} from "../types/order.types"

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<OrdersResponse, OrderQueryParams | void>({
      query: (params) => ({
        url: "/orders",
        method: "GET",
        ...(params && { params }),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Order" as const,
                id,
              })),
              { type: "Order" as const, id: "LIST" },
            ]
          : [{ type: "Order" as const, id: "LIST" }],
    }),

    getOrder: builder.query<Order, string>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Order", id }],
    }),

    updateOrderStatus: builder.mutation<
      Order,
      { id: string; data: UpdateOrderStatusRequest }
    >({
      query: ({ id, data }) => ({
        url: `/orders/${id}/status`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Order", id },
        { type: "Order", id: "LIST" },
        "Dashboard",
        "Analytics",
      ],
    }),

    cancelOrder: builder.mutation<Order, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/orders/${id}/cancel`,
        method: "PATCH",
        body: reason ? { reason } : {},
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Order", id },
        { type: "Order", id: "LIST" },
        "Dashboard",
        "Analytics",
        "Stock",
      ],
    }),
  }),
})

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
} = ordersApi
