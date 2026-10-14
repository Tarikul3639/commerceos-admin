import { baseApi } from "@/lib/api/base-api"

import type {
  SizeGuide,
  SizeGuidePayload,
  SizeGuideQueryParams,
  SizeGuidesResponse,
} from "../types/size-guide.types"

export const sizeGuidesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSizeGuide: builder.mutation<SizeGuide, SizeGuidePayload>({
      query: (body) => ({
        url: "/admin/size-guides",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "SizeGuide", id: "LIST" }],
    }),
    getSizeGuides: builder.query<
      SizeGuidesResponse,
      SizeGuideQueryParams | void
    >({
      query: (params) => ({
        url: "/admin/size-guides",
        method: "GET",
        ...(params && { params }),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "SizeGuide" as const, id })),
              { type: "SizeGuide" as const, id: "LIST" },
            ]
          : [{ type: "SizeGuide" as const, id: "LIST" }],
    }),
    getSizeGuide: builder.query<SizeGuide, string>({
      query: (id) => `/admin/size-guides/${id}`,
      providesTags: (_result, _error, id) => [{ type: "SizeGuide", id }],
    }),
    updateSizeGuide: builder.mutation<
      SizeGuide,
      { id: string; data: SizeGuidePayload }
    >({
      query: ({ id, data }) => ({
        url: `/admin/size-guides/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "SizeGuide", id },
        { type: "SizeGuide", id: "LIST" },
      ],
    }),
    deleteSizeGuide: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/size-guides/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "SizeGuide", id },
        { type: "SizeGuide", id: "LIST" },
      ],
    }),
  }),
})

export const {
  useCreateSizeGuideMutation,
  useGetSizeGuidesQuery,
  useGetSizeGuideQuery,
  useUpdateSizeGuideMutation,
  useDeleteSizeGuideMutation,
} = sizeGuidesApi
