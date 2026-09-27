"use client"

import { useState } from "react"

import { useLazyGetCloudinarySignatureQuery } from "@/features/uploads/api/upload.api"

interface CloudinaryUploadResponse {
  secure_url: string
  public_id: string
  original_filename: string
  resource_type: string
  format: string
  width?: number
  height?: number
}

interface UploadOptions {
  folder?: string
}

export function useCloudinaryUpload() {
  const [getCloudinarySignature] = useLazyGetCloudinarySignatureQuery()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const upload = async (
    file: File,
    options?: UploadOptions
  ): Promise<CloudinaryUploadResponse> => {
    setIsUploading(true)
    setProgress(0)
    setError(null)

    try {
      const folder = options?.folder ?? "uploads"

      // Get signature from backend
      const signature = await getCloudinarySignature(folder).unwrap()

      const formData = new FormData()

      formData.append("file", file)
      formData.append("api_key", signature.apiKey)
      formData.append("timestamp", String(signature.timestamp))
      formData.append("signature", signature.signature)
      formData.append("folder", signature.folder)

      // Upload to Cloudinary
      const result = await new Promise<CloudinaryUploadResponse>(
        (resolve, reject) => {
          const xhr = new XMLHttpRequest()

          xhr.open(
            "POST",
            `https://api.cloudinary.com/v1_1/${signature.cloudName}/auto/upload`
          )

          // Upload progress
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percentage = Math.round((event.loaded / event.total) * 100)
              setProgress(percentage)
            }
          }

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const data = JSON.parse(xhr.responseText)

                resolve(data)
              } catch {
                reject(new Error("Invalid Cloudinary response"))
              }

              return
            }

            reject(new Error("Cloudinary upload failed"))
          }

          xhr.onerror = () => {
            reject(new Error("Network error during upload"))
          }

          xhr.onabort = () => {
            reject(new Error("Upload cancelled"))
          }

          xhr.send(formData)
        }
      )

      setProgress(100)

      return result
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed"
      setError(message)
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  return {
    upload,
    isUploading,
    progress,
    error,
  }
}
