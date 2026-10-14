import { baseApi } from "@/lib/api/base-api"

import type {
  CreateProductRequest,
  ProductQueryParams,
  ProductsResponse,
  UpdateProductRequest,
} from "../types/product.types"

import type { ProductDetails } from "../types/product-details.types"

const productTags = (id: string) => [
  "Product" as const,
  { type: "Product" as const, id },
]

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, ProductQueryParams | void>({
      query: (params) => ({
        url: "/admin/products",
        method: "GET",
        ...(params && { params }),
      }),
      providesTags: ["Product"],
    }),

    getProductDetails: builder.query<ProductDetails, string>({
      query: (id) => ({
        url: `/admin/products/${id}/details`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),

    createProduct: builder.mutation<ProductDetails, CreateProductRequest>({
      query: (body) => ({
        url: "/admin/products",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation<
      ProductDetails,
      { id: string; data: UpdateProductRequest }
    >({
      query: ({ id, data }) => ({
        url: `/admin/products/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => productTags(id),
    }),

    saveProductGeneral: builder.mutation<
      ProductDetails,
      { id: string; data: UpdateProductRequest }
    >({
      query: ({ id, data }) => ({
        url: `/admin/products/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => productTags(id),
    }),

    deleteProduct: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    restoreProduct: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/admin/products/${id}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
})

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useSaveProductGeneralMutation,
  useDeleteProductMutation,
  useRestoreProductMutation,
} = productApi
