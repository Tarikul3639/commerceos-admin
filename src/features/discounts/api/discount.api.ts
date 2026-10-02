import type {
  AssignProductDiscountRequest,
  CreateDiscountRequest,
  Discount,
  DiscountWithPagination,
  DiscountProductsResponse,
  DiscountQueryParams,
  UpdateDiscountRequest,
} from "../types/discount.types"

import { baseApi } from "@/lib/api/base-api"

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
      query: (id) => ({
        url: `/discounts/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Discount", id }],
    }),

    // ──────────────────────────────────────────────────────────────
    // Discount with Products
    // ──────────────────────────────────────────────────────────────

    getDiscountProducts: builder.query<
      DiscountProductsResponse,
      {
        discountId: string
        params?: Pick<DiscountQueryParams, "search" | "page" | "limit">
      }
    >({
      query: ({ discountId, params }) => ({
        url: `/discounts/${discountId}/products`,
        method: "GET",
        ...(params && { params }),
      }),
      providesTags: (_result, _error, { discountId }) => [
        { type: "Discount", id: discountId },
      ],
    }),

    createDiscount: builder.mutation<Discount, CreateDiscountRequest>({
      query: (body) => ({
        url: "/discounts",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Discount"],
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
        { type: "Discount", id },
      ],
    }),

    deleteDiscount: builder.mutation<void, string>({
      query: (id) => ({
        url: `/discounts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Discount"],
    }),

    assignProductDiscount: builder.mutation<
      Discount,
      {
        discountId: string
        data: AssignProductDiscountRequest
      }
    >({
      query: ({ discountId, data }) => ({
        url: `/discounts/${discountId}/products`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, { discountId }) => [
        "Discount",
        { type: "Discount", id: discountId },
      ],
    }),

    removeProductDiscount: builder.mutation<
      void,
      {
        discountId: string
        productId: string
      }
    >({
      query: ({ discountId, productId }) => ({
        url: `/discounts/${discountId}/products/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { discountId }) => [
        "Discount",
        { type: "Discount", id: discountId },
      ],
    }),
  }),
})

export const {
  useGetDiscountsQuery,
  useGetDiscountQuery,
  useGetDiscountProductsQuery,
  useCreateDiscountMutation,
  useUpdateDiscountMutation,
  useDeleteDiscountMutation,
  useAssignProductDiscountMutation,
  useRemoveProductDiscountMutation,
} = discountApi
