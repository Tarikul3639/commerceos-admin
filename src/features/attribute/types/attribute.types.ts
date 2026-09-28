export interface AttributeValue {
    id: string
    value: string
    attributeId: string
    createdAt: string
    updatedAt: string
}

export interface Attribute {
    id: string
    name: string
    values: AttributeValue[]
    createdAt: string
    updatedAt: string
}

export interface CreateAttributeRequest {
    name: string
}

export interface UpdateAttributeRequest extends Partial<CreateAttributeRequest> { }

export interface CreateAttributeValueRequest {
    value: string
}

export interface UpdateAttributeValueRequest extends Partial<CreateAttributeValueRequest> { }
