import { forwardRef } from 'react'
import { ArrowUp, LoaderCircle, MessageSquarePlus, Sparkles, X } from 'lucide-react'

const suggestions = [
  'What is the core objective of this document?',
  'Summarize key methodologies and architectural decisions',
  'What quantitative results and benchmarks are reported?',
  'What limitations or potential trade-offs are noted?'
]

const QuestionInput = forwardRef(function QuestionInput({ value, querying, onChange, onSubmit, onClear }, ref) {
  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      onSubmit()
    }
  }

  return (
    <section className="panel p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
          <MessageSquarePlus size={18} className="text-cyan-400" />
          <span>Neural Query Console</span>
        </div>
        <span className="text-[11px] font-medium text-slate-400">
          {value.length > 0 ? `${value.length} / 4000 chars` : 'Markdown & Multi-chunk Search'}
        </span>
      </div>

      <div className="composer mt-4">
        <textarea
          ref={ref}
          rows={4}
          value={value}
          onChange={event => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={querying}
          maxLength={4000}
          aria-label="Query across indexed documents"
          placeholder="Ask a technical or contextual question about your indexed documents…"
          className="composer-input"
        />
        <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] bg-space-950/40 px-4 py-3">
          <span className="hidden text-[11px] font-medium text-slate-400 sm:block">
            Press <kbd className="rounded border border-white/[0.1] bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">Enter</kbd> to query · <kbd className="rounded border border-white/[0.1] bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">Shift + Enter</kbd> for newline
          </span>
          <div className="ml-auto flex items-center gap-2">
            {value && (
              <button
                className="icon-button h-8 w-8"
                onClick={onClear}
                disabled={querying}
                aria-label="Clear question"
              >
                <X size={15} />
              </button>
            )}
            <button
              className="ask-button"
              onClick={onSubmit}
              disabled={!value.trim() || querying}
              aria-label="Submit query"
            >
              {querying ? (
                <>
                  <LoaderCircle className="animate-spin" size={15} />
                  <span>Synthesizing…</span>
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  <span>Query Nexus</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="section-kicker">Recommended Inquiries</p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {suggestions.map(suggestion => (
            <button
              key={suggestion}
              className="suggestion-chip"
              onClick={() => {
                onChange(suggestion)
                window.requestAnimationFrame(() => ref.current?.focus())
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
})

export default QuestionInput
