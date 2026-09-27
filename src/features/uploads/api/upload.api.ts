import { baseApi } from "@/lib/api/base-api"

export interface CloudinarySignatureResponse {
  timestamp: number
  signature: string
  folder: string
  cloudName: string
  apiKey: string
}

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCloudinarySignature: builder.query<CloudinarySignatureResponse, string>({
      query: (folder) => ({
        url: `/uploads/signature/${folder}`,
        method: "GET",
      }),
    }),
  }),
})

export const { useLazyGetCloudinarySignatureQuery } = uploadApi
