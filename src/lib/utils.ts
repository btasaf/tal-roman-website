export function cleanWhatsApp(phone?: string): string | undefined {
  return phone?.replace(/\D/g, '')
}
