export function safeString(value: unknown): string {
  if (typeof value === 'string') {
    return value.replace(/[<>"'`]/g, '')
  }
  return String(value ?? '')
}

export function maskSecret(value: unknown): string {
  const str = String(value ?? '')
  if (str.length <= 6) return '******'
  return `${str.slice(0, 3)}...${str.slice(-3)}`
}

export function formatUserMessage(message: string): string {
  return safeString(message.trim())
}
