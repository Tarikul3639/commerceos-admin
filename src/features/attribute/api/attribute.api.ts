import type {
    Attribute,
    AttributeValue,
    CreateAttributeRequest,
    CreateAttributeValueRequest,
    UpdateAttributeRequest,
    UpdateAttributeValueRequest,
} from "../types/attribute.types"

import { baseApi } from "@/lib/api/base-api"

export const attributeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAttributes: builder.query<Attribute[], void>({
            query: () => ({
                url: "/attributes",
                method: "GET",
            }),

            providesTags: ["Attribute"],
        }),

        getAttribute: builder.query<Attribute, string>({
            query: (id) => ({
                url: `/attributes/${id}`,
                method: "GET",
            }),

            providesTags: (_result, _error, id) => [{ type: "Attribute", id }],
        }),

        createAttribute: builder.mutation<Attribute, CreateAttributeRequest>({
            query: (body) => ({
                url: "/attributes",
                method: "POST",
                body,
            }),

            invalidatesTags: ["Attribute"],
        }),

        updateAttribute: builder.mutation<
            Attribute,
            { id: string; data: UpdateAttributeRequest }
        >({
            query: ({ id, data }) => ({
                url: `/attributes/${id}`,
                method: "PATCH",
                body: data,
            }),

            invalidatesTags: (_result, _error, { id }) => [
                "Attribute",
                { type: "Attribute", id },
            ],
        }),

        deleteAttribute: builder.mutation<void, string>({
            query: (id) => ({
                url: `/attributes/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Attribute"],
        }),

        // ── Attribute value ──────────────────────────────────────────

        createAttributeValue: builder.mutation<
            AttributeValue,
            {
                attributeId: string
                data: CreateAttributeValueRequest
            }
        >({
            query: ({ attributeId, data }) => ({
                url: `/attributes/${attributeId}/values`,
                method: "POST",
                body: data,
            }),

            invalidatesTags: (_result, _error, { attributeId }) => [
                "Attribute",
                { type: "Attribute", id: attributeId },
            ],
        }),

        updateAttributeValue: builder.mutation<
            AttributeValue,
            {
                valueId: string
                data: UpdateAttributeValueRequest
            }
        >({
            query: ({ valueId, data }) => ({
                url: `/attributes/values/${valueId}`,
                method: "PATCH",
                body: data,
            }),

            invalidatesTags: ["Attribute"],
        }),

        deleteAttributeValue: builder.mutation<void, string>({
            query: (valueId) => ({
                url: `/attributes/values/${valueId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Attribute"],
        }),
    }),
})

export const {
    useGetAttributesQuery,
    useGetAttributeQuery,
    useCreateAttributeMutation,
    useUpdateAttributeMutation,
    useDeleteAttributeMutation,
    useCreateAttributeValueMutation,
    useUpdateAttributeValueMutation,
    useDeleteAttributeValueMutation,
} = attributeApi
