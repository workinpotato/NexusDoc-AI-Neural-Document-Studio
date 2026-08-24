import { Clock3, Sparkles } from 'lucide-react'

export default function QueryHistory({ history, onSelect }) {
  if (!history.length) return null
  return (
    <section className="panel p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock3 size={14} className="text-cyan-400" />
          <p className="section-kicker">Query History</p>
        </div>
        <span className="text-[10px] font-mono font-medium text-slate-400">Cached in local storage</span>
      </div>
      <div className="mt-3 space-y-1.5">
        {history.slice(0, 5).map(item => (
          <button
            key={item}
            className="history-item flex items-center justify-between group"
            onClick={() => onSelect(item)}
          >
            <span className="truncate flex-1">{item}</span>
            <Sparkles size={11} className="ml-2 text-cyan-400 opacity-0 group-hover:opacity-100 transition duration-200" />
          </button>
        ))}
      </div>
    </section>
  )
}
