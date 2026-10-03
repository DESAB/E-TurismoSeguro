/** "3173976877" → "317 397 6877" (otros formatos se devuelven igual) */
export function formatPhone(phone: string): string {
  return /^\d{10}$/.test(phone) ? `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}` : phone
}

/** Enlace tel: a partir de un número escrito con espacios, paréntesis o guiones. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}
