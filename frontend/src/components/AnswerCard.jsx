import { useState } from 'react'
import { AlertTriangle, Bot, Check, Copy, LoaderCircle, Quote, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import Notice from './Notice'

export default function AnswerCard({ answer, sourceCount, loading, error, onRetry }) {
  const [copied, setCopied] = useState(false)

  if (error) {
    return <Notice type="error" title="Generation Interrupted" message={error} onRetry={onRetry} />
  }

  async function handleCopy() {
    if (!answer) return
    try {
      await navigator.clipboard.writeText(answer)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="answer-card">
      <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] bg-space-900/50 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="ai-icon">
            <Bot size={18} />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-white">Answer</p>
              <span className="inline-flex items-center gap-1 rounded-md border border-cyan-400/20 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                <Sparkles size={10} /> Gemini 2.5 Flash
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400">Strictly anchored to retrieved document passages</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!loading && answer && (
            <button
              className={`copy-button ${copied ? 'is-copied' : ''}`}
              onClick={handleCopy}
              aria-label="Copy entire answer"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Copy Answer'}</span>
            </button>
          )}
          {!loading && (
            <span className="count-badge">
              <Quote size={11} /> {sourceCount} {sourceCount === 1 ? 'source' : 'sources'}
            </span>
          )}
        </div>
      </div>

      <div className="px-5 py-6 sm:px-8 sm:py-7">
        {loading ? (
          <div className="flex min-h-32 flex-col items-center justify-center text-center">
            <div className="relative">
              <LoaderCircle className="animate-spin text-cyan-400" size={28} />
              <Sparkles className="absolute -right-2 -top-2 text-teal-300 animate-pulse" size={14} />
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-200">
              Querying FAISS vector index & synthesizing response…
            </p>
            <p className="mt-1 text-xs font-medium text-slate-400">
              Correlating highest-similarity chunks from your active PDFs
            </p>
          </div>
        ) : answer ? (
          <div className="answer-content">
            <ReactMarkdown>{answer}</ReactMarkdown>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-amber-300">
            <AlertTriangle size={16} /> No response was returned.
          </div>
        )}
      </div>
    </section>
  )
}
