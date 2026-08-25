import { Bot, FileSearch2, Sparkles } from 'lucide-react'

export default function AnswerEmptyState() {
  return (
    <div className="answer-card">
      <div className="flex items-center gap-3 border-b border-white/[0.08] bg-space-900/40 px-5 py-4 sm:px-6">
        <span className="ai-icon">
          <Bot size={18} />
        </span>
        <div>
          <p className="text-sm font-bold text-white">Answer</p>
          <p className="text-[11px] font-medium text-slate-400">Awaiting your prompt and document index</p>
        </div>
      </div>
      <div className="flex min-h-[280px] flex-col items-center justify-center px-6 py-12 text-center">
        <span className="empty-icon">
          <FileSearch2 size={26} />
        </span>
        <h3 className="mt-5 text-base font-bold text-slate-100">Ready for Document Analysis</h3>
        <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-400">
          Upload PDFs, then ask a question above to see an answer and the passages that support it.
        </p>
        <div className="mt-6 flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-950/40 px-3.5 py-1.5 text-[11px] font-medium text-cyan-300">
          <Sparkles size={13} />
          <span>Answers include supporting passages</span>
        </div>
      </div>
    </div>
  )
}
