export interface ShippingZone {
  id: string
  districtCity: string
  rate: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ShippingSettings {
  freeShippingThreshold: string | null
  zones: ShippingZone[]
}

export interface UpdateShippingSettingsRequest {
  freeShippingThreshold: number | null
}

export interface ShippingZonePayload {
  districtCity: string
  rate: number
  isActive: boolean
}
