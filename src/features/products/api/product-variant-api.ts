import { baseApi } from "@/lib/api/base-api"

import type {
  CreateProductVariantRequest,
  ProductVariant,
  UpdateProductVariantRequest,
} from "../types/product-variant.types"

const productVariantTags = (productId: string) => [
  "Product" as const,
  { type: "Product" as const, id: productId },
]

export const productVariantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProductVariant: builder.mutation<
      ProductVariant,
      CreateProductVariantRequest
    >({
      query: (body) => ({
        url: "/admin/product-variants",
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { productId }) =>
        productVariantTags(productId),
    }),

    getProductVariants: builder.query<ProductVariant[], string>({
      query: (productId) => ({
        url: `/admin/product-variants/${productId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, productId) =>
        productVariantTags(productId),
    }),

    updateProductVariant: builder.mutation<
      ProductVariant,
      {
        productId: string
        variantId: string
        data: UpdateProductVariantRequest
      }
    >({
      query: ({ variantId, data }) => ({
        url: `/admin/product-variants/${variantId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { productId }) =>
        productVariantTags(productId),
    }),

    deleteProductVariant: builder.mutation<
      ProductVariant,
      { productId: string; variantId: string }
    >({
      query: ({ variantId }) => ({
        url: `/admin/product-variants/${variantId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { productId }) =>
        productVariantTags(productId),
    }),
  }),
})

export const {
  useCreateProductVariantMutation,
  useGetProductVariantsQuery,
  useUpdateProductVariantMutation,
  useDeleteProductVariantMutation,
} = productVariantApi
