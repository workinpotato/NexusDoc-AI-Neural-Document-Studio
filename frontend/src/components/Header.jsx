import { Command, Cpu, Sparkles } from 'lucide-react'

function SystemStatus({ status }) {
  const label = status === 'online' ? 'Ready' : status === 'offline' ? 'Service unavailable' : 'Connecting…'
  return (
    <div className={`status-pill status-${status}`} role="status">
      <span className="status-dot" />
      <span>{label}</span>
    </div>
  )
}

export default function Header({ status, onFocusQuestion }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-space-950/80 backdrop-blur-2xl">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3.5">
          <div className="brand-mark">
            <Cpu size={22} className="text-cyan-300 animate-pulse-subtle" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate text-base font-extrabold tracking-tight text-white">
                NexusDoc
              </span>
              <span className="hidden rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan-300 sm:inline-block">
                Docs
              </span>
            </div>
            <div className="hidden text-[11px] font-medium text-slate-400 sm:block">
              Search and cite your PDF documents
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <SystemStatus status={status} />
          <button className="shortcut-button" onClick={onFocusQuestion} aria-label="Focus query composer">
            <Command size={12} />
            <span>K</span>
          </button>
        </div>
      </div>
    </header>
  )
}
