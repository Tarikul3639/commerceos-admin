export interface NotificationPreferences {
  ordersInApp: boolean
  ordersEmail: boolean
  returnsInApp: boolean
  returnsEmail: boolean
  inventoryInApp: boolean
  inventoryEmail: boolean
  paymentsInApp: boolean
  paymentsEmail: boolean
  createdAt: string
  updatedAt: string
}

export type UpdateNotificationPreferencesRequest = Partial<
  Pick<
    NotificationPreferences,
    | "ordersInApp"
    | "ordersEmail"
    | "returnsInApp"
    | "returnsEmail"
    | "inventoryInApp"
    | "inventoryEmail"
    | "paymentsInApp"
    | "paymentsEmail"
  >
>
