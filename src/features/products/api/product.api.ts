import { baseApi } from "@/lib/api/base-api"

import type {
    AddProductImageRequest,
    CreateProductRequest,
    CreateProductVariantRequest,
    Product,
    ProductDetails,
    ProductQueryParams,
    ProductsResponse,
    UpdateProductImageRequest,
    UpdateProductRequest,
    UpdateProductVariantRequest,
} from "../types/product.types"

export const productApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query<ProductsResponse, ProductQueryParams | void>({
            query: (params) => ({
                url: "/products",
                method: "GET",
                ...(params && { params }),
            }),
            providesTags: ["Product"],
        }),

        getProduct: builder.query<ProductDetails, string>({
            query: (id) => ({
                url: `/products/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: "Product", id }],
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
            Product,
            { id: string; data: UpdateProductRequest }
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

        addProductImage: builder.mutation<
            ProductDetails,
            {
                productId: string
                data: AddProductImageRequest
            }
        >({
            query: ({ productId, data }) => ({
                url: `/products/${productId}/images`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (_result, _error, { productId }) => [
                { type: "Product", id: productId },
            ],
        }),

        updateProductImage: builder.mutation<
            ProductDetails,
            {
                productId: string
                imageId: string
                data: UpdateProductImageRequest
            }
        >({
            query: ({ productId, imageId, data }) => ({
                url: `/products/${productId}/images/${imageId}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (_result, _error, { productId }) => [
                { type: "Product", id: productId },
            ],
        }),

        deleteProductImage: builder.mutation<
            void,
            {
                productId: string
                imageId: string
            }
        >({
            query: ({ productId, imageId }) => ({
                url: `/products/${productId}/images/${imageId}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, { productId }) => [
                { type: "Product", id: productId },
            ],
        }),

        createProductVariant: builder.mutation<
            ProductDetails,
            {
                productId: string
                data: CreateProductVariantRequest
            }
        >({
            query: ({ productId, data }) => ({
                url: `/products/${productId}/variants`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (_result, _error, { productId }) => [
                "Product",
                { type: "Product", id: productId },
            ],
        }),

        updateProductVariant: builder.mutation<
            ProductDetails,
            {
                productId: string
                variantId: string
                data: UpdateProductVariantRequest
            }
        >({
            query: ({ productId, variantId, data }) => ({
                url: `/products/${productId}/variants/${variantId}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (_result, _error, { productId }) => [
                "Product",
                { type: "Product", id: productId },
            ],
        }),

        deleteProductVariant: builder.mutation<
            void,
            {
                productId: string
                variantId: string
            }
        >({
            query: ({ productId, variantId }) => ({
                url: `/products/${productId}/variants/${variantId}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, { productId }) => [
                "Product",
                { type: "Product", id: productId },
            ],
        }),
    }),
})

export const {
    useGetProductsQuery,
    useGetProductQuery,
    useGetProductDetailsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useAddProductImageMutation,
    useUpdateProductImageMutation,
    useDeleteProductImageMutation,
    useCreateProductVariantMutation,
    useUpdateProductVariantMutation,
    useDeleteProductVariantMutation,
} = productApi
