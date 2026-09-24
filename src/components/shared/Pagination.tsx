import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  /** Path the page links point at, e.g. "/artikel". */
  basePath: string
  /** Accessible name, in case a page ever shows two of these. */
  label?: string
}

type Item = number | 'gap'

/**
 * First page, last page, and a window around the current one, with gaps for
 * whatever is skipped. Keeps the control a fixed width however long the
 * archive grows.
 */
function pageItems(current: number, total: number): Item[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const shown = new Set<number>([1, total, current, current - 1, current + 1])
  const pages = [...shown].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)

  const items: Item[] = []
  pages.forEach((page, i) => {
    if (i > 0 && page - pages[i - 1] > 1) items.push('gap')
    items.push(page)
  })
  return items
}

function hrefFor(basePath: string, page: number): string {
  return page <= 1 ? basePath : `${basePath}?page=${page}`
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  label = 'Navigasi halaman',
}: PaginationProps) {
  if (totalPages <= 1) return null

  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  const base =
    'min-w-10 h-10 px-3 inline-flex items-center justify-center rounded-full text-[14px] font-semibold transition-all duration-200'
  const idle = 'bg-white text-[#2b6955] border border-[#7ab8a0]/30 hover:bg-[#7ab8a0]/10 hover:-translate-y-0.5'
  const disabled = 'bg-white/60 text-[#404944]/40 border border-[#bfc9c3]/30 cursor-not-allowed'

  return (
    <nav aria-label={label} className="flex justify-center">
      <ul className="flex flex-wrap items-center justify-center gap-2" style={{ fontFamily: 'Inter' }}>
        <li>
          {hasPrev ? (
            <Link href={hrefFor(basePath, currentPage - 1)} rel="prev" className={`${base} ${idle}`}>
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              <span className="hidden sm:inline ml-1">Sebelumnya</span>
            </Link>
          ) : (
            <span aria-disabled="true" className={`${base} ${disabled}`}>
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              <span className="hidden sm:inline ml-1">Sebelumnya</span>
            </span>
          )}
        </li>

        {pageItems(currentPage, totalPages).map((item, i) =>
          item === 'gap' ? (
            <li key={`gap-${i}`} aria-hidden="true" className="px-1 text-[#404944]/50 select-none">
              …
            </li>
          ) : item === currentPage ? (
            <li key={item}>
              <span aria-current="page" className={`${base} bg-[#5CB2B2] text-white shadow-sm`}>
                {item}
              </span>
            </li>
          ) : (
            <li key={item}>
              <Link
                href={hrefFor(basePath, item)}
                aria-label={`Halaman ${item}`}
                className={`${base} ${idle}`}
              >
                {item}
              </Link>
            </li>
          )
        )}

        <li>
          {hasNext ? (
            <Link href={hrefFor(basePath, currentPage + 1)} rel="next" className={`${base} ${idle}`}>
              <span className="hidden sm:inline mr-1">Berikutnya</span>
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </Link>
          ) : (
            <span aria-disabled="true" className={`${base} ${disabled}`}>
              <span className="hidden sm:inline mr-1">Berikutnya</span>
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </span>
          )}
        </li>
      </ul>
    </nav>
  )
}
