import { baseApi } from "@/lib/api/base-api"

import type {
  CreateUserPayload,
  UpdateUserPayload,
  UpdateUserStatusPayload,
  User,
  UserListResponse,
  UserQueryParams,
} from "../types/user.types"

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Create user
     */
    createUser: builder.mutation<User, CreateUserPayload>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    /**
     * Get all users
     */
    getUsers: builder.query<UserListResponse, UserQueryParams | void>({
      query: (params) => ({
        url: "/users",
        params: params ?? undefined,
      }),
      providesTags: ["User"],
    }),

    /**
     * Get user by ID
     */
    getUser: builder.query<User, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
      }),
      providesTags: ["User"],
    }),

    /**
     * Update user
     */
    updateUser: builder.mutation<
      User,
      {
        userId: string
        data: UpdateUserPayload
      }
    >({
      query: ({ userId, data }) => ({
        url: `/users/${userId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    /**
     * Update user status
     */
    updateUserStatus: builder.mutation<
      User,
      {
        userId: string
        data: UpdateUserStatusPayload
      }
    >({
      query: ({ userId, data }) => ({
        url: `/users/${userId}/status`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    /**
     * Restore deleted user
     */
    restoreUser: builder.mutation<User, string>({
      query: (userId) => ({
        url: `/users/${userId}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: ["User"],
    }),

    /**
     * Delete user
     */
    deleteUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
})

export const {
  useCreateUserMutation,
  useGetUsersQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useUpdateUserStatusMutation,
  useRestoreUserMutation,
  useDeleteUserMutation,
} = userApi
