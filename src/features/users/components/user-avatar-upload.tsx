"use client"

import { Camera, ImagePlus, X } from "lucide-react"
import { useRef, useState } from "react"

import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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
  const fileInputRef = useRef<HTMLInputElement>(null)

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

    const maxSize = 1 * 1024 * 1024

    if (file.size > maxSize) {
      toast.error("Avatar must be smaller than 1MB.")

      return
    }

    try {
      const image = await createImageBitmap(file)
      const isSquare = image.width === image.height

      image.close()

      if (!isSquare) {
        toast.error("Please upload a square image.")

        return
      }
    } catch {
      toast.error("Unable to read the selected image.")

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
      <div className="group relative">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          aria-label={value ? "Change avatar" : "Upload avatar"}
          className="relative block rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed"
        >
          <Avatar className="h-24 w-24">
            <AvatarImage src={value || undefined} alt="User avatar" />
            <AvatarFallback>
              <ImagePlus className="h-8 w-8 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-black/45 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            {isUploading ? (
              <span className="text-xs font-semibold">{progress}%</span>
            ) : (
              <Camera className="size-5" />
            )}
          </span>
        </button>

        {value && !isUploading && !disabled && (
          <Button
            type="button"
            variant="destructive"
            size="icon-xs"
            className="absolute -top-1 right-0 rounded-full! bg-destructive text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 hover:bg-destructive/90"
            onClick={handleRemove}
          >
            <X />
            <span className="sr-only">Remove avatar</span>
          </Button>
        )}
      </div>

      {/* File input */}
      <input
        ref={fileInputRef}
        id="user-avatar"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        disabled={disabled || isUploading}
        onChange={handleUpload}
      />

      <Button
        type="button"
        size="xs"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled || isUploading}
      >
        {value ? "Change avatar" : "Upload avatar"}
      </Button>

      {/* Description */}
      <p className="text-center text-xs text-muted-foreground">
        Use a square image (1:1 aspect ratio) for the best result. JPG, PNG or WebP. Maximum file size: 1MB.
      </p>

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