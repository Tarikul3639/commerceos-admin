import { baseApi } from "@/lib/api/base-api"
import type {
  EmailLog,
  EmailLogQuery,
  EmailLogsResponse,
} from "../types/email.types"

export const emailsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmailLogs: builder.query<EmailLogsResponse, EmailLogQuery | void>({
      query: (params) => ({
        url: "/emails",
        method: "GET",
        ...(params && { params }),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Email" as const, id })),
              { type: "Email" as const, id: "LIST" },
            ]
          : [{ type: "Email" as const, id: "LIST" }],
    }),
    getEmailLog: builder.query<EmailLog, string>({
      query: (id) => "/emails/" + id,
      providesTags: (_result, _error, id) => [{ type: "Email", id }],
    }),
  }),
})

export const { useGetEmailLogsQuery, useGetEmailLogQuery } = emailsApi
