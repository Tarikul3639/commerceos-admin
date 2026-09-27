export function formatCurrency(
  value: number | string,
  options?: {
    symbol?: string
    compact?: boolean
  }
) {
  const amount = Number(value)
  const symbol = options?.symbol ?? "৳"
  const compact = options?.compact ?? true

  if (Number.isNaN(amount)) {
    return `${symbol}0`
  }

  const abs = Math.abs(amount)

  if (!compact) {
    return `${symbol}${amount.toLocaleString()}`
  }

  if (abs >= 1_000_000_000) {
    return `${symbol}${(amount / 1_000_000_000).toFixed(1)}B`
  }

  if (abs >= 1_000_000) {
    return `${symbol}${(amount / 1_000_000).toFixed(1)}M`
  }

  if (abs >= 1_000) {
    return `${symbol}${(amount / 1_000).toFixed(1)}K`
  }

  return `${symbol}${amount.toLocaleString()}`
}
