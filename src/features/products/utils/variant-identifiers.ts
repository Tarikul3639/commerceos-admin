export function generateSku(name: string, options: string[]) {
  const nameCode = name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .toUpperCase()

  const optionCode = options
    .map((option) => option.trim().replace(/\s+/g, ""))
    .filter(Boolean)
    .join("-")
    .toUpperCase()

  const randomCode = Math.floor(100 + Math.random() * 900)

  return [nameCode, optionCode, randomCode].filter(Boolean).join("-")
}

function getEan13CheckDigit(firstTwelveDigits: string): number {
  const sum = [...firstTwelveDigits].reduce(
    (total, digit, index) => total + Number(digit) * (index % 2 === 0 ? 1 : 3),
    0
  )
  return (10 - (sum % 10)) % 10
}

/**
 * Generates an internal EAN-13-shaped identifier.
 * It is not a GS1-licensed retail barcode.
 */
export function generateInternalBarcode(): string {
  const random = new Uint8Array(10)
  crypto.getRandomValues(random)
  const randomDigits = [...random].map((value) => String(value % 10)).join("")
  const firstTwelveDigits = `29${randomDigits}`

  return `${firstTwelveDigits}${getEan13CheckDigit(firstTwelveDigits)}`
}
