import { useRef, useState } from 'react'
import { FileText, FileUp, LoaderCircle, Sparkles, Trash2, UploadCloud } from 'lucide-react'

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`
}

export default function UploadZone({ files, uploading, onFiles, onRemove, onUpload }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  function handleDrop(event) {
    event.preventDefault()
    setDragging(false)
    onFiles(Array.from(event.dataTransfer.files))
  }

  return (
    <section className="panel p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="section-kicker">Knowledge Ingestion</p>
          <h2 className="mt-1 text-base font-bold text-white">Upload Documents</h2>
        </div>
        <span className="count-badge">{files.length} selected</span>
      </div>

      <button
        type="button"
        className={`upload-zone mt-4 ${dragging ? 'is-dragging' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragEnter={event => { event.preventDefault(); setDragging(true) }}
        onDragOver={event => event.preventDefault()}
        onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false) }}
        onDrop={handleDrop}
      >
        <span className="upload-icon">
          <UploadCloud size={24} />
        </span>
        <span className="mt-3 text-sm font-semibold text-slate-100">Drop PDF documents here</span>
        <span className="mt-1 text-xs text-slate-400">or click to browse local files</span>
      </button>
      <input
        id="pdf-input"
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        multiple
        className="sr-only"
        onChange={event => { onFiles(Array.from(event.target.files)); event.target.value = '' }}
      />

      {files.length > 0 && (
        <div className="mt-4 space-y-2" aria-label="Selected PDF files">
          {files.map((file, index) => (
            <div className="file-row" key={`${file.name}-${file.size}-${file.lastModified}`}>
              <span className="pdf-icon">
                <FileText size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-200">{file.name}</p>
                <p className="mt-0.5 text-[11px] font-medium text-slate-400">{formatSize(file.size)}</p>
              </div>
              <button
                className="icon-button h-8 w-8 text-slate-400 hover:text-rose-400"
                onClick={() => onRemove(index)}
                disabled={uploading}
                aria-label={`Remove ${file.name}`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        className="primary-button mt-5 w-full"
        onClick={onUpload}
        disabled={!files.length || uploading}
      >
        {uploading ? (
          <>
            <LoaderCircle className="animate-spin text-space-950" size={17} />
            <span>Chunking & Indexing Embeddings…</span>
          </>
        ) : (
          <>
            <FileUp size={16} />
            <span>Index {files.length ? `${files.length} Document${files.length > 1 ? 's' : ''}` : 'Knowledge Base'}</span>
          </>
        )}
      </button>
      
      {!uploading && (
        <p className="mt-3 text-center text-[11px] font-medium leading-relaxed text-slate-400">
          Indexing transforms PDFs into high-dimensional FAISS vectors for semantic retrieval.
        </p>
      )}
      {uploading && (
        <p className="mt-3 text-center text-[11px] font-medium leading-relaxed text-cyan-400/90 animate-pulse">
          Processing text chunks and generating vector embeddings with Gemini & FAISS…
        </p>
      )}
    </section>
  )
}
