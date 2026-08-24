import { AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react'

export default function Notice({ type, title, message, onRetry }) {
  const Icon = type === 'success' ? CheckCircle2 : AlertTriangle
  return (
    <div className={`notice notice-${type}`} role={type === 'error' ? 'alert' : 'status'}>
      <Icon size={19} className="shrink-0 mt-0.5" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-white">{title}</p>
        <p className="mt-0.5 text-xs font-medium leading-relaxed opacity-85">{message}</p>
      </div>
      {onRetry && (
        <button className="secondary-button !min-h-8 !px-2.5 !py-1 text-[11px]" onClick={onRetry}>
          <RotateCcw size={12} /> Retry
        </button>
      )}
    </div>
  )
}
