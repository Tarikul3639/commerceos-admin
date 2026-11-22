export interface AnnouncementSettings {
  message: string
  isActive: boolean
  updatedAt: string
}

export interface UpdateAnnouncementSettingsRequest {
  message: string
  isActive: boolean
}
