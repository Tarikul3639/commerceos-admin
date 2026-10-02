import {
  createApi,
  fetchBaseQuery,
  type FetchArgs,
  type BaseQueryFn,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react"

import { Mutex } from "async-mutex"
import { logout } from "@/store/slices/auth.slice"

const mutex = new Mutex()

const PUBLIC_AUTH_ENDPOINTS = [
  "/auth/user/login",
  "/auth/user/register",
  "/auth/user/forgot-password",
  "/auth/user/reset-password",
]

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
})

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock()

  let result = await baseQuery(args, api, extraOptions)
  const url = typeof args === "string" ? args : args.url
  const isPublicAuthEndpoint = PUBLIC_AUTH_ENDPOINTS.some((endpoint) =>
    url.startsWith(endpoint)
  )

  if (result.error?.status === 401 && !isPublicAuthEndpoint) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()

      try {
        const refreshResult = await baseQuery(
          {
            url: "/auth/user/refresh",
            method: "POST",
          },
          api,
          extraOptions
        )

        if (refreshResult.data) {
          result = await baseQuery(args, api, extraOptions)
        } else {
          // Refresh failed.
          // Clear auth state / redirect to login here.
          api.dispatch(logout())
          result = refreshResult
        }
      } finally {
        release()
      }
    } else {
      await mutex.waitForUnlock()

      result = await baseQuery(args, api, extraOptions)
    }
  }
  return result
}

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: baseQueryWithReauth,

  tagTypes: [
    "Auth",
    "User",
    "Customer",
    "Permissions",
    "Dashboard",
    "Analytics",
    "Banner",
    "Brand",
    "Category",
    "Discount",
    "Product",
    "Supplier",
    "Purchase",
    "Order",
    "Stock",
    "Employee",
  ],

  endpoints: () => ({}),
})
