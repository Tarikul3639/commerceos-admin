import { baseApi } from "@/lib/api/base-api"

import type {
  MarkAllNotificationsReadResponse,
  Notification,
  NotificationQueryParams,
  NotificationsResponse,
} from "../types/notification.types"

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationsResponse, NotificationQueryParams | void>({
      query: (params) => ({
        url: "/notifications",
        method: "GET",
        ...(params && { params }),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Notification" as const, id })),
              { type: "Notification" as const, id: "LIST" },
            ]
          : [{ type: "Notification" as const, id: "LIST" }],
    }),
    getNotification: builder.query<Notification, string>({
      query: (id) => ({ url: `/notifications/${id}`, method: "GET" }),
      providesTags: (_result, _error, id) => [{ type: "Notification", id }],
    }),
    markNotificationRead: builder.mutation<Notification, string>({
      query: (id) => ({ url: `/notifications/${id}/read`, method: "PATCH" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Notification", id },
        { type: "Notification", id: "LIST" },
      ],
    }),
    markAllNotificationsRead: builder.mutation<MarkAllNotificationsReadResponse, void>({
      query: () => ({ url: "/notifications/read-all", method: "PATCH" }),
      invalidatesTags: [{ type: "Notification", id: "LIST" }],
    }),
    deleteNotification: builder.mutation<void, string>({
      query: (id) => ({ url: `/notifications/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Notification", id },
        { type: "Notification", id: "LIST" },
      ],
    }),
  }),
})

export const {
  useGetNotificationsQuery,
  useGetNotificationQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
} = notificationsApi
