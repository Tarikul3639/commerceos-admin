import { baseApi } from "@/lib/api/base-api"
import type { CartQueryParams, CartsResponse } from "../types/cart.types"

export const cartsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCarts: builder.query<CartsResponse, CartQueryParams | void>({
      query: (params) => ({
        url: "/admin/carts",
        method: "GET",
        ...(params && { params }),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Cart" as const,
                id,
              })),
              { type: "Cart" as const, id: "LIST" },
            ]
          : [{ type: "Cart" as const, id: "LIST" }],
    }),
  }),
})

export const { useGetCartsQuery } = cartsApi
