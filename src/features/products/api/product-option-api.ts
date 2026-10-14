import { baseApi } from "@/lib/api/base-api"

import type {
  CreateProductOptionRequest,
  ProductOption,
  UpdateProductOptionRequest,
} from "../types/product-option.types"
import type { ProductVariant } from "../types/product-variant.types"

const productOptionTags = (productId: string) => [
  "Product" as const,
  { type: "Product" as const, id: productId },
]

export const productOptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProductOption: builder.mutation<
      ProductOption,
      CreateProductOptionRequest
    >({
      query: (body) => ({
        url: "/admin/product-options",
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { productId }) =>
        productOptionTags(productId),
    }),

    getProductOptions: builder.query<ProductOption[], string>({
      query: (productId) => ({
        url: `/admin/product-options/${productId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, productId) =>
        productOptionTags(productId),
    }),

    updateProductOption: builder.mutation<
      ProductOption,
      {
        productId: string
        optionId: string
        data: UpdateProductOptionRequest
      }
    >({
      query: ({ optionId, data }) => ({
        url: `/admin/product-options/${optionId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { productId }) =>
        productOptionTags(productId),
    }),

    deleteProductOption: builder.mutation<
      { message: string },
      { productId: string; optionId: string }
    >({
      query: ({ optionId }) => ({
        url: `/admin/product-options/${optionId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { productId }) =>
        productOptionTags(productId),
    }),

    generateProductVariants: builder.mutation<ProductVariant[], string>({
      query: (productId) => ({
        url: `/admin/product-options/${productId}/generate-variants`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, productId) =>
        productOptionTags(productId),
    }),
  }),
})

export const {
  useCreateProductOptionMutation,
  useGetProductOptionsQuery,
  useUpdateProductOptionMutation,
  useDeleteProductOptionMutation,
  useGenerateProductVariantsMutation,
} = productOptionApi
