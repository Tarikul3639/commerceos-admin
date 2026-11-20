import { baseApi } from "@/lib/api/base-api"

import type { SearchResponse } from "../types/search.types"

export const searchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    globalSearch: builder.query<SearchResponse, string>({
      query: (q) => ({
        url: "/search",
        params: { q },
      }),
    }),
  }),
})

export const { useLazyGlobalSearchQuery } = searchApi
