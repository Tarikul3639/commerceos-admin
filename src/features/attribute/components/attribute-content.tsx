"use client"

import { PageContainer } from "@/components/layout/page-container"
import { DataTable } from "@/components/data-table"

import { useGetAttributesQuery } from "../api/attribute.api"
import { columns } from "./attribute-columns"
import { CreateAttributeDialog } from "./create-attribute-dialog"
import { attributeDemoData } from "../data/attributes.data"

export function AttributeContent() {
    const { data: attributes = [], isLoading } = useGetAttributesQuery()

    return (
        <PageContainer
            pageTitle="Attributes"
            pageDescription="Manage product attributes and their values."
            pageHeaderAction={<CreateAttributeDialog />}
        >
            <DataTable
                title="Attributes"
                description="Manage product attributes and their values."
                data={attributes}
                columns={columns}
                isLoading={isLoading}
                columnVisibility={true}
            />
        </PageContainer>
    )
}
