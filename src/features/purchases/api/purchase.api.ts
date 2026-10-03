import { baseApi } from "@/lib/api/base-api"
import type {
  CreatePurchaseRequest,
  Purchase,
  PurchaseListResponse,
  PurchaseQuery,
  UpdatePurchaseRequest,
} from "../types/purchase.types"

export const purchaseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPurchases: builder.query<PurchaseListResponse, PurchaseQuery | void>({
      query: (params) => ({
        url: "/purchases",
        method: "GET",
        ...(params && { params }),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Purchase" as const,
                id,
              })),
              { type: "Purchase", id: "LIST" },
            ]
          : [{ type: "Purchase", id: "LIST" }],
    }),
    getPurchase: builder.query<Purchase, string>({
      query: (id) => ({ url: `/purchases/${id}`, method: "GET" }),
      providesTags: (_result, _error, id) => [{ type: "Purchase", id }],
    }),
    createPurchase: builder.mutation<Purchase, CreatePurchaseRequest>({
      query: (body) => ({ url: "/purchases", method: "POST", body }),
      invalidatesTags: [{ type: "Purchase", id: "LIST" }, "Product"],
    }),
    updatePurchase: builder.mutation<
      Purchase,
      { id: string; data: UpdatePurchaseRequest }
    >({
      query: ({ id, data }) => ({
        url: `/purchases/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Purchase", id },
        { type: "Purchase", id: "LIST" },
        "Product",
      ],
    }),
    receivePurchase: builder.mutation<unknown, { id: string; note?: string }>({
      query: ({ id, ...body }) => ({
        url: `/purchases/${id}/receive`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Purchase", id },
        { type: "Purchase", id: "LIST" },
        "Product",
      ],
    }),
    cancelPurchase: builder.mutation<void, { id: string; reason?: string }>({
      query: ({ id, ...body }) => ({
        url: `/purchases/${id}/cancel`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Purchase", id },
        { type: "Purchase", id: "LIST" },
      ],
    }),
    deletePurchase: builder.mutation<void, string>({
      query: (id) => ({ url: `/purchases/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Purchase", id },
        { type: "Purchase", id: "LIST" },
      ],
    }),
  }),
})
export const {
  useGetPurchasesQuery,
  useGetPurchaseQuery,
  useCreatePurchaseMutation,
  useUpdatePurchaseMutation,
  useReceivePurchaseMutation,
  useCancelPurchaseMutation,
  useDeletePurchaseMutation,
} = purchaseApi
