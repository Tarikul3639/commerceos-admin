import type { Permission } from "@/config/permissions.config"
import type { Role } from "@/config/roles.config"

export interface CurrentUserResponse {
  id: string
  name: string
  email: string
  phone: string | null
  avatar: string | null
  publicId: string | null
  role: Role
  permissions: Permission[]
  isVerified: boolean
  lastLoginAt: string | null
  createdAt: string
}

export interface UpdateCurrentUserProfileRequest {
  name?: string
  phone?: string | null
  avatar?: string | null
  publicId?: string | null
}

export interface CurrentUserPayload {
  id: string
  email: string
  role: string
  permissions: string[]
}

export interface UserLoginRequest {
  email: string
  password: string
  remember: boolean
}

export interface UserLoginResponse {
  message: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface ChangePasswordResponse {
  message: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  message: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
}

export interface ResetPasswordResponse {
  message: string
}

export interface VerifyEmailRequest {
  token: string
}

export interface VerifyEmailResponse {
  message: string
}

export interface ResendVerificationEmailRequest {
  email: string
}

export interface ResendVerificationEmailResponse {
  message: string
}
