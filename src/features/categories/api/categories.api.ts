import { baseApi } from "@/lib/api/base-api"

import type {
  Category,
  CategoriesResponse,
  CreateCategory,
  UpdateCategory,
  CategoryQueryParams,
} from "../types/categories.types"

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation<Category, CreateCategory>({
      query: (body) => ({
        url: "/categories",
        method: "POST",
        body,
      }),

      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),

    getCategories: builder.query<
      CategoriesResponse,
      CategoryQueryParams | void
    >({
      query: (params) => ({
        url: "/categories",
        method: "GET",
        ...(params && { params }),
      }),

      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Category" as const,
                id,
              })),
              {
                type: "Category" as const,
                id: "LIST",
              },
            ]
          : [
              {
                type: "Category" as const,
                id: "LIST",
              },
            ],
    }),

    getCategory: builder.query<Category, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "GET",
      }),

      providesTags: (_result, _error, id) => [
        {
          type: "Category",
          id,
        },
      ],
    }),

    updateCategory: builder.mutation<
      Category,
      {
        id: string
        data: UpdateCategory
      }
    >({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: (_result, _error, { id }) => [
        {
          type: "Category",
          id,
        },
        {
          type: "Category",
          id: "LIST",
        },
      ],
    }),

    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: (_result, _error, id) => [
        {
          type: "Category",
          id,
        },
        {
          type: "Category",
          id: "LIST",
        },
      ],
    }),
  }),
})

export const {
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi
