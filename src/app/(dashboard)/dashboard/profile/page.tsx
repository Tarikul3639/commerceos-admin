import type { Metadata } from "next"

import { ProfileContent } from "@/features/profile/components/profile-content"

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your account information and security.",
}

export default function ProfilePage() {
  return <ProfileContent />
}
