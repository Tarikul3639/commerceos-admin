import { baseApi } from "@/lib/api/base-api"

import type {
  ActivityLog,
  ActivityLogQuery,
  ActivityLogsResponse,
} from "../types/activity-log.types"

export const activityLogsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActivityLogs: builder.query<
      ActivityLogsResponse,
      ActivityLogQuery | void
    >({
      query: (params) => ({
        url: "/activity-logs",
        method: "GET",
        ...(params && { params }),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "ActivityLog" as const,
                id,
              })),
              { type: "ActivityLog" as const, id: "LIST" },
            ]
          : [{ type: "ActivityLog" as const, id: "LIST" }],
    }),
    getActivityLog: builder.query<ActivityLog, string>({
      query: (id) => `/activity-logs/${id}`,
      providesTags: (_result, _error, id) => [{ type: "ActivityLog", id }],
    }),
  }),
})

export const { useGetActivityLogsQuery, useGetActivityLogQuery } =
  activityLogsApi
