"use client"

import DOMPurify from "dompurify"

interface ProductDescriptionProps {
  description: string | null
}

export function ProductDescription({
  description,
}: ProductDescriptionProps) {
  if (!description) {
    return (
      <div className="min-h-50 max-w-4xl p-3 md:p-4">
        <p className="text-base leading-6 text-muted-foreground">
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
    <div className="min-h-50 max-w-4xl p-3 md:px-4">
      <div
        className="text-base leading-6 [&_p]:text-[16px] [&_p]:leading-6 [&_a]:cursor-pointer [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-primary/80 [&_blockquote]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_blockquote]:italic [&_h1]:mb-2 [&_h1]:text-[64px] [&_h1]:leading-tight [&_h1]:font-bold [&_h2]:mb-2 [&_h2]:text-[48px] [&_h2]:leading-tight [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:text-[34px] [&_h3]:leading-tight [&_h3]:font-semibold [&_h4]:mb-1 [&_h4]:text-[24px] [&_h4]:leading-tight [&_h4]:font-semibold [&_h5]:my-1.5 [&_h5]:text-[19px] [&_h5]:leading-tight [&_h5]:font-semibold [&_h6]:my-1.5 [&_h6]:text-[18px] [&_h6]:leading-normal [&_h6]:font-semibold [&_ol]:my-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:text-[16px] [&_li]:leading-relaxed [&_li]:marker:text-muted-foreground"
        dangerouslySetInnerHTML={{
          __html: cleanDescription,
        }}
      />
    </div>
  )
}