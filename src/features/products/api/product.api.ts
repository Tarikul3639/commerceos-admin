import { baseApi } from "@/lib/api/base-api"

import type {
  CreateProductRequest,
  Product,
  ProductDetails,
  ProductQueryParams,
  ProductsResponse,
  UpdateProductRequest,
} from "../types/product.types"

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Products
    getProducts: builder.query<ProductsResponse, ProductQueryParams | void>({
      query: (params) => ({
        url: "/products",
        method: "GET",
        ...(params && { params }),
      }),
      providesTags: ["Product"],
    }),

    getProductDetails: builder.query<ProductDetails, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),

    createProduct: builder.mutation<Product, CreateProductRequest>({
      query: (body) => ({
        url: "/products",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation<
      ProductDetails,
      {
        id: string
        data: UpdateProductRequest
      }
    >({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Product",
        { type: "Product", id },
      ],
    }),

    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    restoreProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}/restore`,
        method: "POST",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
})

export const {
  // Products
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useRestoreProductMutation,
} = productApi
