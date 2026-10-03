"use client"

import DOMPurify from "dompurify"

interface ProductDescriptionProps {
  description: string | null
}

export function ProductDescription({ description }: ProductDescriptionProps) {
  if (!description) {
    return (
      <div className="min-h-50 max-w-4xl p-3 md:p-4">
        <p className="text-sm text-muted-foreground">
          No description available.
        </p>
      </div>
    )
  }

  const cleanDescription = DOMPurify.sanitize(description, {
    USE_PROFILES: {
      html: true,
    },
  })

  return (
    <div className="min-h-50 max-w-4xl p-3 md:p-4">
      <div
        className="text-sm leading-7 [&_a]:cursor-pointer [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-primary/80 [&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_blockquote]:italic [&_h1]:mb-3 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h4]:mb-2 [&_h4]:text-lg [&_h4]:font-semibold [&_h5]:mb-2 [&_h5]:text-base [&_h5]:font-semibold [&_h6]:mb-2 [&_h6]:text-sm [&_h6]:font-semibold [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6"
        dangerouslySetInnerHTML={{
          __html: cleanDescription,
        }}
      />
    </div>
  )
}
