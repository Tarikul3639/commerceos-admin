import { baseApi } from "@/lib/api/base-api"
import type {
  Discount,
  DiscountPayload,
  DiscountsResponse,
  DiscountQueryParams,
} from "../types/discount.types"

export const discountsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDiscounts: builder.query<DiscountsResponse, DiscountQueryParams | void>({
      query: (params) => ({
        url: "/discounts",
        method: "GET",
        ...(params && { params }),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Discount" as const,
                id,
              })),
              { type: "Discount" as const, id: "LIST" },
            ]
          : [{ type: "Discount" as const, id: "LIST" }],
    }),
    getDiscount: builder.query<Discount, string>({
      query: (id) => ({ url: `/discounts/${id}`, method: "GET" }),
      providesTags: (_result, _error, id) => [{ type: "Discount", id }],
    }),
    createDiscount: builder.mutation<Discount, DiscountPayload>({
      query: (body) => ({ url: "/discounts", method: "POST", body }),
      invalidatesTags: [{ type: "Discount", id: "LIST" }],
    }),
    updateDiscount: builder.mutation<
      Discount,
      { id: string; data: Partial<DiscountPayload> }
    >({
      query: ({ id, data }) => ({
        url: `/discounts/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Discount", id },
        { type: "Discount", id: "LIST" },
      ],
    }),
    deleteDiscount: builder.mutation<void, string>({
      query: (id) => ({ url: `/discounts/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Discount", id },
        { type: "Discount", id: "LIST" },
      ],
    }),
  }),
})

export const {
  useGetDiscountsQuery,
  useGetDiscountQuery,
  useCreateDiscountMutation,
  useUpdateDiscountMutation,
  useDeleteDiscountMutation,
} = discountsApi
