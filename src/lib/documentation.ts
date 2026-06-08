/**
 * Shared documentation category definitions.
 * Used by the admin editor, public gallery tabs, and the seeder.
 */
export const DOC_CATEGORIES = [
  { id: 'kids-growth', label: 'Kids Growth' },
  { id: 'tpa', label: 'TPA / Daycare' },
  { id: 'kb', label: 'KB' },
  { id: 'tk', label: 'TK Alif' },
  { id: 'bimbel', label: 'Bimbel' },
  { id: 'paud', label: 'PAUD (Umum)' },
] as const

export type DocCategory = (typeof DOC_CATEGORIES)[number]['id']

export const DOC_CATEGORY_IDS = DOC_CATEGORIES.map((c) => c.id) as DocCategory[]

export function docCategoryLabel(id: string): string {
  return DOC_CATEGORIES.find((c) => c.id === id)?.label ?? id
}
