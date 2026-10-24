import { API_BASE, type LookupResult } from '@/shared/api'

export async function lookupWord(surface: string, context?: string): Promise<LookupResult> {
  const res = await fetch(`${API_BASE}/lookup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ surface, context }),
  })
  if (!res.ok) throw new Error(`lookup failed: ${res.status}`)
  return res.json()
}
