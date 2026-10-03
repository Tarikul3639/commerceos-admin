import { baseApi } from "@/lib/api/base-api"
import type {
  CreateDiscountRequest,
  Discount,
  DiscountQueryParams,
  DiscountWithPagination,
  UpdateDiscountRequest,
} from "../types/discount.types"

export const discountApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDiscounts: builder.query<
      DiscountWithPagination,
      DiscountQueryParams | void
    >({
      query: (params) => ({
        url: "/discounts",
        method: "GET",
        ...(params && { params }),
      }),
      providesTags: ["Discount"],
    }),
    getDiscount: builder.query<Discount, string>({
      query: (id) => ({ url: `/discounts/${id}`, method: "GET" }),
      providesTags: (_result, _error, id) => [{ type: "Discount", id }],
    }),
    createDiscount: builder.mutation<Discount, CreateDiscountRequest>({
      query: (body) => ({ url: "/discounts", method: "POST", body }),
      invalidatesTags: ["Discount", "Product"],
    }),
    updateDiscount: builder.mutation<
      Discount,
      { id: string; data: UpdateDiscountRequest }
    >({
      query: ({ id, data }) => ({
        url: `/discounts/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Discount",
        "Product",
        { type: "Discount", id },
      ],
    }),
    deleteDiscount: builder.mutation<void, string>({
      query: (id) => ({ url: `/discounts/${id}`, method: "DELETE" }),
      invalidatesTags: ["Discount", "Product"],
    }),
  }),
})

export const {
  useGetDiscountsQuery,
  useGetDiscountQuery,
  useCreateDiscountMutation,
  useUpdateDiscountMutation,
  useDeleteDiscountMutation,
} = discountApi
