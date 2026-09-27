"use client"

import { ImagePlus, Loader2, Upload, X } from "lucide-react"
import { useState } from "react"

import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

import { getErrorMessage } from "@/lib/utils/error"

import { useCloudinaryUpload } from "@/hooks/use-cloudinary-upload"

interface UserAvatarUploadProps {
  value?: string
  onChange: (value: { url: string; publicId: string }) => void
  disabled?: boolean
}

export function UserAvatarUpload({
  value,
  onChange,
  disabled = false,
}: UserAvatarUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null)

  const { upload, isUploading, progress } = useCloudinaryUpload()

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    event.target.value = ""

    if (!file) {
      return
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, and WebP images are allowed.")

      return
    }

    const maxSize = 5 * 1024 * 1024

    if (file.size > maxSize) {
      toast.error("Avatar must be smaller than 5MB.")

      return
    }

    setFileName(file.name)

    try {
      const result = await upload(file, {
        folder: "users",
      })

      onChange({
        url: result.secure_url,
        publicId: result.public_id,
      })

      toast.success("Avatar uploaded successfully.")
    } catch (error) {
      console.error("Avatar upload failed:", error)

      setFileName(null)

      toast.error(getErrorMessage(error) || "Failed to upload avatar.")
    }
  }

  const handleRemove = () => {
    onChange({ url: "", publicId: "" })
    setFileName(null)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Avatar */}
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={value || undefined} alt="User avatar" />

          <AvatarFallback>
            <ImagePlus className="h-8 w-8 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>

        {value && !isUploading && !disabled && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-1 -right-1 h-6 w-6 rounded-full"
            onClick={handleRemove}
          >
            <X className="h-3 w-3" />

            <span className="sr-only">Remove avatar</span>
          </Button>
        )}
      </div>

      {/* File input */}
      <input
        id="user-avatar"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        disabled={disabled || isUploading}
        onChange={handleUpload}
      />

      {/* Upload button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled || isUploading}
        asChild
      >
        <Label htmlFor="user-avatar" className="cursor-pointer text-sm">
          {isUploading ? (
            <>
              <Loader2 className="animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload />
              {value ? "Change avatar" : "Upload avatar"}
            </>
          )}
        </Label>
      </Button>

      {/* File name */}
      {fileName && (
        <p className="max-w-xs truncate text-xs text-muted-foreground">
          {fileName}
        </p>
      )}

      {/* Progress */}
      {isUploading && (
        <div className="w-full max-w-xs space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>

          <Progress value={progress} />
        </div>
      )}
    </div>
  )
}
