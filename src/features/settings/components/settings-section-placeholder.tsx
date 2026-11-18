interface SettingsSectionPlaceholderProps {
  title: string
  description: string
  requirements: string
}

export function SettingsSectionPlaceholder({
  title,
  description,
  requirements,
}: SettingsSectionPlaceholderProps) {
  return (
    <section className="mx-auto w-full max-w-5xl space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="rounded-lg border bg-card p-5">
        <h2 className="text-sm font-medium">Configuration is not available yet</h2>
        <p className="mt-2 text-sm text-muted-foreground">{requirements}</p>
      </div>
    </section>
  )
}
