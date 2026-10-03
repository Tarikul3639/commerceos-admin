import { baseApi } from "@/lib/api/base-api"
import type {
  CreatePurchaseReturnRequest,
  PurchaseReturn,
  PurchaseReturnListResponse,
  PurchaseReturnQuery,
} from "../types/purchase-return.types"

export const purchaseReturnApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPurchaseReturns: builder.query<
      PurchaseReturnListResponse,
      PurchaseReturnQuery | void
    >({
      query: (params) => ({
        url: "/purchase-returns",
        method: "GET",
        ...(params && { params }),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "PurchaseReturn" as const,
                id,
              })),
              { type: "PurchaseReturn", id: "LIST" },
            ]
          : [{ type: "PurchaseReturn", id: "LIST" }],
    }),
    getPurchaseReturn: builder.query<PurchaseReturn, string>({
      query: (id) => ({ url: `/purchase-returns/${id}`, method: "GET" }),
      providesTags: (_result, _error, id) => [{ type: "PurchaseReturn", id }],
    }),
    createPurchaseReturn: builder.mutation<
      PurchaseReturn,
      CreatePurchaseReturnRequest
    >({
      query: (body) => ({ url: "/purchase-returns", method: "POST", body }),
      invalidatesTags: [{ type: "PurchaseReturn", id: "LIST" }, "Purchase"],
    }),
    approvePurchaseReturn: builder.mutation<
      { id: string; status: "APPROVED" },
      string
    >({
      query: (id) => ({
        url: `/purchase-returns/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "PurchaseReturn", id },
        { type: "PurchaseReturn", id: "LIST" },
        "Purchase",
      ],
    }),
    rejectPurchaseReturn: builder.mutation<
      { id: string; status: "REJECTED" },
      string
    >({
      query: (id) => ({
        url: `/purchase-returns/${id}/reject`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "PurchaseReturn", id },
        { type: "PurchaseReturn", id: "LIST" },
        "Purchase",
      ],
    }),
    completePurchaseReturn: builder.mutation<
      { id: string; status: "COMPLETED" },
      string
    >({
      query: (id) => ({
        url: `/purchase-returns/${id}/complete`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "PurchaseReturn", id },
        { type: "PurchaseReturn", id: "LIST" },
        "Purchase",
      ],
    }),
    deletePurchaseReturn: builder.mutation<void, string>({
      query: (id) => ({ url: `/purchase-returns/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "PurchaseReturn", id },
        { type: "PurchaseReturn", id: "LIST" },
        "Purchase",
      ],
    }),
  }),
})

export const {
  useGetPurchaseReturnsQuery,
  useGetPurchaseReturnQuery,
  useCreatePurchaseReturnMutation,
  useApprovePurchaseReturnMutation,
  useRejectPurchaseReturnMutation,
  useCompletePurchaseReturnMutation,
  useDeletePurchaseReturnMutation,
} = purchaseReturnApi
