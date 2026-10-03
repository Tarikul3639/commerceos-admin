import { baseApi } from "@/lib/api/base-api"

import type {
  Supplier,
  SupplierListResponse,
  SupplierQuery,
  SupplierRequest,
} from "../types/supplier.types"

export const supplierApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSuppliers: builder.query<SupplierListResponse, SupplierQuery | void>({
      query: (params) => ({
        url: "/suppliers",
        method: "GET",
        ...(params && { params }),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Supplier" as const,
                id,
              })),
              { type: "Supplier" as const, id: "LIST" },
            ]
          : [{ type: "Supplier" as const, id: "LIST" }],
    }),

    getSupplier: builder.query<Supplier, string>({
      query: (id) => ({
        url: `/suppliers/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Supplier", id }],
    }),

    createSupplier: builder.mutation<Supplier, SupplierRequest>({
      query: (body) => ({
        url: "/suppliers",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Supplier", id: "LIST" }],
    }),

    updateSupplier: builder.mutation<
      Supplier,
      { id: string; data: Partial<SupplierRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/suppliers/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Supplier", id },
        { type: "Supplier", id: "LIST" },
      ],
    }),

    deleteSupplier: builder.mutation<void, string>({
      query: (id) => ({
        url: `/suppliers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Supplier", id },
        { type: "Supplier", id: "LIST" },
      ],
    }),
  }),
})

export const {
  useGetSuppliersQuery,
  useGetSupplierQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = supplierApi
