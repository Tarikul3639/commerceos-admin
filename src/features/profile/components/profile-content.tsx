"use client"

import { RefreshCw } from "lucide-react"

import { PageContainer } from "@/components/layout/page-container"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetCurrentUserQuery } from "@/features/auth/auth.api"

import { AccountInformationCard } from "./account-information-card"
import { ChangePasswordForm } from "./change-password-form"
import { PersonalInformationForm } from "./personal-information-form"
import { ProfileOverview } from "./profile-overview"

const breadcrumbs = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "My Profile" },
]

export function ProfileContent() {
  const { data, isLoading, isFetching, error, refetch } =
    useGetCurrentUserQuery()

  return (
    <PageContainer
      title="My Profile"
      breadcrumbs={breadcrumbs}
      pageHeaderAction={
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => void refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      }
    >
      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Unable to load your profile</AlertTitle>
          <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
            <span>Your account information could not be retrieved.</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
            >
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      ) : isLoading || !data ? (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <Skeleton className="h-[440px] rounded-xl" />
          <Skeleton className="h-[440px] rounded-xl" />
        </div>
      ) : (
        <div className="space-y-5 pb-8">
          <ProfileOverview user={data} />

          <div className="grid items-start gap-5 xl:grid-cols-2">
            <PersonalInformationForm user={data} />
            <div className="space-y-5">
              <ChangePasswordForm />
              <AccountInformationCard user={data} />
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  )
}
