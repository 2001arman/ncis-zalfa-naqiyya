'use client'

import { useState } from 'react'
import { DOC_CATEGORIES } from '@/lib/documentation'
import { cldUrl } from '@/lib/cld-url'

export interface DocItem {
  id: string
  imageUrl: string
  caption: string | null
  category: string
}

export default function DocGallery({ docs }: { docs: DocItem[] }) {
  const [active, setActive] = useState<string>('all')

  // Only show category tabs that actually have photos.
  const present = new Set(docs.map((d) => d.category))
  const tabs = [
    { id: 'all', label: 'Semua' },
    ...DOC_CATEGORIES.filter((c) => present.has(c.id)),
  ]

  const filtered = active === 'all' ? docs : docs.filter((d) => d.category === active)

  return (
    <div className="flex flex-col gap-10">
      {/* Tabs */}
      <div className="flex justify-center">
        <div className="overflow-x-auto w-full flex justify-center pb-3">
          <div className="bg-[#fef9f1]/85 backdrop-blur-md border border-white/30 py-3 px-4 md:px-6 rounded-full shadow-md flex gap-2 md:gap-3 justify-center min-w-max">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`font-semibold text-xs md:text-sm px-4 md:px-5 py-2 rounded-full transition-all ${active === t.id ? 'bg-[#fc758d] text-[#720628]' : 'text-[#3e4948] hover:bg-[#ece8e0]'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-[#3e4948] py-12">Belum ada dokumentasi pada kategori ini.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {filtered.map((doc, i) => (
            <figure key={doc.id} className="overflow-hidden rounded-[20px] md:rounded-[28px] shadow-md group aspect-square relative bg-[#ece8e0]">
              <img
                src={cldUrl(doc.imageUrl, 'f_auto,q_auto,w_800')}
                alt={doc.caption ?? `Dokumentasi ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {doc.caption && (
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent text-white text-xs p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  {doc.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}
    </div>
  )
}
