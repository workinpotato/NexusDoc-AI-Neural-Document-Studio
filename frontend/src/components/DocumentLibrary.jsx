import { CheckCircle2, Database, FileText, Library } from 'lucide-react'

function formatSize(bytes) {
  return bytes < 1024 ** 2
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / 1024 ** 2).toFixed(1)} MB`
}

export default function DocumentLibrary({ documents }) {
  return (
    <section className="panel p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <Database size={13} className="text-cyan-400" />
            <p className="section-kicker">Documents</p>
          </div>
          <h2 className="mt-1 text-sm font-bold text-white">Current collection</h2>
        </div>
        <span className="count-badge">{documents.length} indexed</span>
      </div>

      {documents.length ? (
        <div className="mt-4 space-y-2">
          {documents.map(document => (
            <div className="document-card" key={document.name}>
              <span className="pdf-icon">
                <FileText size={15} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-200">{document.name}</p>
                <p className="mt-0.5 text-[11px] font-medium text-slate-400">{formatSize(document.size)}</p>
              </div>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                <CheckCircle2 size={13} /> Active
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-white/[0.08] px-4 py-4 text-xs font-medium text-slate-400">
          <Library size={16} className="text-slate-400" />
          <span>Uploaded documents for this session will appear here.</span>
        </div>
      )}
    </section>
  )
}
