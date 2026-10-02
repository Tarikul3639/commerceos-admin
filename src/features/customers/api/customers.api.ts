import { baseApi } from "@/lib/api/base-api"

import type {
  Customer,
  CustomersResponse,
  CreateCustomer,
  UpdateCustomer,
  CustomerQueryParams,
} from "../types/customers.types"

export const customersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCustomer: builder.mutation<Customer, CreateCustomer>({
      query: (body) => ({
        url: "/customers",
        method: "POST",
        body,
      }),

      invalidatesTags: [{ type: "Customer", id: "LIST" }],
    }),

    getCustomers: builder.query<CustomersResponse, CustomerQueryParams | void>({
      query: (params) => ({
        url: "/customers",
        method: "GET",
        ...(params && { params }),
      }),

      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Customer" as const,
                id,
              })),
              { type: "Customer" as const, id: "LIST" },
            ]
          : [{ type: "Customer" as const, id: "LIST" }],
    }),

    getCustomer: builder.query<Customer, string>({
      query: (id) => ({
        url: `/customers/${id}`,
        method: "GET",
      }),

      providesTags: (_result, _error, id) => [{ type: "Customer", id }],
    }),

    updateCustomer: builder.mutation<
      Customer,
      {
        id: string
        data: UpdateCustomer
      }
    >({
      query: ({ id, data }) => ({
        url: `/customers/${id}`,
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: (_result, _error, { id }) => [
        { type: "Customer", id },
        { type: "Customer", id: "LIST" },
      ],
    }),

    deleteCustomer: builder.mutation<void, string>({
      query: (id) => ({
        url: `/customers/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: (_result, _error, id) => [
        { type: "Customer", id },
        { type: "Customer", id: "LIST" },
      ],
    }),

    restoreCustomer: builder.mutation<void, string>({
      query: (id) => ({
        url: `/customers/${id}/restore`,
        method: "PATCH",
      }),

      invalidatesTags: (_result, _error, id) => [
        { type: "Customer", id },
        { type: "Customer", id: "LIST" },
      ],
    }),
  }),
})

export const {
  useCreateCustomerMutation,
  useGetCustomersQuery,
  useGetCustomerQuery,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useRestoreCustomerMutation,
} = customersApi
