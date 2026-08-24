import { useMemo, useState } from 'react'
import { Check, ChevronDown, Copy, FileText, Search, ShieldCheck } from 'lucide-react'

function SourceCard({ source, index }) {
  const [open, setOpen] = useState(index === 0)
  const [copied, setCopied] = useState(false)

  async function copySource(event) {
    event.stopPropagation()
    try {
      await navigator.clipboard.writeText(source.content)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <article className={`source-card ${open ? 'is-open' : ''}`}>
      <div className="flex items-center gap-3.5 p-4 sm:px-5">
        <span className="source-number">#{String(index + 1).padStart(2, '0')}</span>
        <span className="pdf-icon">
          <FileText size={15} />
        </span>
        <button
          className="min-w-0 flex-1 text-left"
          onClick={() => setOpen(value => !value)}
          aria-expanded={open}
        >
          <div className="flex items-center gap-2">
            <p className="truncate text-xs font-bold text-slate-200">{source.source || 'Document Chunk'}</p>
            <span className="rounded border border-cyan-400/20 bg-cyan-950/60 px-1.5 py-0.5 font-mono text-[9px] font-bold text-cyan-300">
              Rank #{index + 1}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] font-medium text-slate-400">
            {source.page !== '?' && source.page != null ? `Page ${source.page}` : 'Page context inferred'}
          </p>
        </button>
        <button
          className={`copy-button ${copied ? 'is-copied' : ''}`}
          onClick={copySource}
          aria-label={`Copy source citation ${index + 1}`}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
        <button
          className="icon-button h-8 w-8"
          onClick={() => setOpen(value => !value)}
          aria-label={`${open ? 'Collapse' : 'Expand'} source ${index + 1}`}
        >
          <ChevronDown
            className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180 text-cyan-300' : ''}`}
            size={15}
          />
        </button>
      </div>
      <div className="source-content" aria-hidden={!open}>
        <div>
          <div className="border-t border-white/[0.08] bg-space-950/80 px-5 py-4 font-mono text-xs leading-relaxed text-slate-300 whitespace-pre-wrap selection:bg-cyan-500/30">
            {source.content}
          </div>
        </div>
      </div>
    </article>
  )
}

export default function SourceList({ sources }) {
  const [filter, setFilter] = useState('')
  const filteredSources = useMemo(
    () =>
      sources.filter(source =>
        `${source.source} ${source.page} ${source.content}`.toLowerCase().includes(filter.toLowerCase())
      ),
    [sources, filter]
  )

  return (
    <section className="panel p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <p className="section-kicker">Retrieved Context</p>
            <ShieldCheck size={14} className="text-teal-400" />
          </div>
          <h3 className="mt-1 text-base font-bold text-white">
            Grounding Evidence <span className="font-normal text-slate-400">({sources.length} passages)</span>
          </h3>
        </div>
        {sources.length > 2 && (
          <label className="source-search">
            <Search size={14} className="text-slate-400" />
            <span className="sr-only">Filter source passages</span>
            <input
              value={filter}
              onChange={event => setFilter(event.target.value)}
              placeholder="Search evidence…"
            />
          </label>
        )}
      </div>

      <div className="mt-4 space-y-2.5">
        {filteredSources.map((source, index) => (
          <SourceCard
            key={`${source.source}-${source.page}-${index}`}
            source={source}
            index={sources.indexOf(source)}
          />
        ))}
        {!filteredSources.length && (
          <div className="rounded-xl border border-dashed border-white/[0.08] py-8 text-center text-xs text-slate-400">
            No source passages match &ldquo;{filter}&rdquo;.
          </div>
        )}
      </div>
    </section>
  )
}
