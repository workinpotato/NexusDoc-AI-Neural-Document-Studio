import { useEffect, useRef, useState } from 'react'
import { ArrowRight, BookOpen, Cpu, Database, RotateCcw, ShieldCheck, Sparkles, Zap } from 'lucide-react'
import Header from './components/Header'
import UploadZone from './components/UploadZone'
import DocumentLibrary from './components/DocumentLibrary'
import QuestionInput from './components/QuestionInput'
import QueryHistory from './components/QueryHistory'
import AnswerCard from './components/AnswerCard'
import AnswerEmptyState from './components/AnswerEmptyState'
import SourceList from './components/SourceList'
import Notice from './components/Notice'
import { askQuestion, checkHealth, uploadDocuments } from './services/api'

const HISTORY_KEY = 'nexus-doc-ai-history'

function readHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []
  } catch {
    return []
  }
}

export default function App() {
  const [systemStatus, setSystemStatus] = useState('checking')
  const [selectedFiles, setSelectedFiles] = useState([])
  const [indexedDocuments, setIndexedDocuments] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadNotice, setUploadNotice] = useState(null)
  const [question, setQuestion] = useState('')
  const [querying, setQuerying] = useState(false)
  const [answer, setAnswer] = useState('')
  const [sources, setSources] = useState([])
  const [queryError, setQueryError] = useState('')
  const [history, setHistory] = useState(readHistory)
  const questionRef = useRef(null)

  useEffect(() => {
    let active = true
    checkHealth()
      .then(() => active && setSystemStatus('online'))
      .catch(() => active && setSystemStatus('offline'))
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    function focusQuestion(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        questionRef.current?.focus()
      }
    }
    window.addEventListener('keydown', focusQuestion)
    return () => window.removeEventListener('keydown', focusQuestion)
  }, [])

  function addFiles(incomingFiles) {
    const pdfs = Array.from(incomingFiles).filter(
      file => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    )
    const rejectedCount = incomingFiles.length - pdfs.length
    setSelectedFiles(current => {
      const existing = new Set(current.map(file => `${file.name}-${file.size}-${file.lastModified}`))
      return [...current, ...pdfs.filter(file => !existing.has(`${file.name}-${file.size}-${file.lastModified}`))]
    })
    setUploadNotice(
      rejectedCount
        ? {
            type: 'error',
            title: 'Unsupported file format',
            message: `${rejectedCount} non-PDF file${rejectedCount === 1 ? ' was' : 's were'} skipped. NexusDoc AI accepts PDF documents.`
          }
        : null
    )
  }

  async function handleUpload() {
    if (!selectedFiles.length || uploading) return
    setUploading(true)
    setUploadNotice(null)
    const pendingFiles = [...selectedFiles]
    try {
      const data = await uploadDocuments(pendingFiles)
      const uploadedNames = new Set(data.files)
      const indexed = pendingFiles
        .filter(file => uploadedNames.has(file.name))
        .map(file => ({ name: file.name, size: file.size, indexedAt: Date.now() }))
      setIndexedDocuments(indexed)
      setSelectedFiles([])
      setUploadNotice({
        type: 'success',
        title: 'Vector Index Created',
        message: `${data.files.length} document${data.files.length === 1 ? ' was' : 's were'} parsed and indexed into FAISS.`
      })
      setSystemStatus('online')
      window.setTimeout(() => questionRef.current?.focus(), 100)
    } catch (error) {
      setUploadNotice({
        type: 'error',
        title: 'Knowledge Ingestion Failed',
        message: error.message || 'An unexpected error occurred while processing documents.'
      })
    } finally {
      setUploading(false)
    }
  }

  async function handleQuery() {
    const cleanQuestion = question.trim()
    if (!cleanQuestion || querying) return
    setQuerying(true)
    setAnswer('')
    setSources([])
    setQueryError('')
    try {
      const data = await askQuestion(cleanQuestion)
      setAnswer(data.answer)
      setSources(data.sources || [])
      const nextHistory = [cleanQuestion, ...history.filter(item => item !== cleanQuestion)].slice(0, 12)
      setHistory(nextHistory)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory))
      setSystemStatus('online')
    } catch (error) {
      setQueryError(error.message || 'Failed to generate a grounded response.')
    } finally {
      setQuerying(false)
    }
  }

  function clearResult() {
    setQuestion('')
    setAnswer('')
    setSources([])
    setQueryError('')
    questionRef.current?.focus()
  }

  const hasResult = Boolean(answer || queryError || querying)

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <Header status={systemStatus} onFocusQuestion={() => questionRef.current?.focus()} />

      <main className="relative mx-auto w-full max-w-[1280px] px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <div className="ambient-glow" aria-hidden="true" />

        {/* Hero Studio Banner */}
        <section className="hero-panel relative overflow-hidden rounded-[28px] px-6 py-7 sm:px-8 sm:py-8">
          <div className="relative z-10 max-w-3xl">
            <div className="eyebrow">
              <Sparkles size={13} className="text-cyan-300" />
              <span>Document workspace</span>
            </div>
            <h1 className="mt-4 max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-5xl sm:leading-[1.15]">
              Find answers in your documents, with the source close at hand.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Upload PDFs, ask a focused question, and review the passages used to form each answer.
            </p>

            {/* Pipeline Steps */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5 text-xs text-slate-400">
              {[
                { label: 'Add PDFs', icon: BookOpen },
                { label: 'Index documents', icon: Database },
                { label: 'Search context', icon: Cpu },
                { label: 'Review sources', icon: ShieldCheck }
              ].map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={step.label} className="flex items-center gap-2">
                    <span className="flow-step">{index + 1}</span>
                    <span className="flex items-center gap-1 font-semibold text-slate-200">
                      <Icon size={12} className="text-cyan-400" />
                      {step.label}
                    </span>
                    {index < 3 && (
                      <ArrowRight className="mx-1 hidden text-slate-600 sm:block" size={13} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="hero-orbit" aria-hidden="true">
            <Database size={34} className="text-cyan-400/40" />
            <Cpu size={24} className="text-teal-400/50" />
          </div>
        </section>

        {/* Workbench Workspace Grid */}
        <div className="mt-5 grid items-start gap-5 lg:grid-cols-[minmax(340px,0.82fr)_minmax(0,1.45fr)]">
          {/* Left Column: Knowledge Base Bay */}
          <div className="space-y-5 min-w-0">
            <UploadZone
              files={selectedFiles}
              uploading={uploading}
              onFiles={addFiles}
              onRemove={index => setSelectedFiles(files => files.filter((_, fileIndex) => fileIndex !== index))}
              onUpload={handleUpload}
            />

            <DocumentLibrary documents={indexedDocuments} />

            <QueryHistory
              history={history}
              onSelect={value => {
                setQuestion(value)
                questionRef.current?.focus()
              }}
            />
          </div>

          {/* Right Column: Neural Query & Answer Canvas */}
          <div className="space-y-5 min-w-0">
            <QuestionInput
              ref={questionRef}
              value={question}
              querying={querying}
              onChange={setQuestion}
              onSubmit={handleQuery}
              onClear={() => setQuestion('')}
            />

            {uploadNotice && (
              <Notice
                {...uploadNotice}
                onRetry={uploadNotice.type === 'error' && selectedFiles.length ? handleUpload : undefined}
              />
            )}

            {/* Answer & Evidence Canvas */}
            <div className={hasResult ? 'result-enter space-y-5' : 'space-y-5'}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="section-kicker">Answer</p>
                  <h2 className="mt-0.5 text-lg font-bold text-white">Response and sources</h2>
                </div>
                {(answer || queryError) && (
                  <button className="secondary-button" onClick={clearResult}>
                    <RotateCcw size={13} /> Clear
                  </button>
                )}
              </div>

              {hasResult ? (
                <AnswerCard
                  answer={answer}
                  sourceCount={sources.length}
                  loading={querying}
                  error={queryError}
                  onRetry={handleQuery}
                />
              ) : (
                <AnswerEmptyState />
              )}

              {!querying && sources.length > 0 && <SourceList sources={sources} />}
            </div>
          </div>
        </div>
      </main>

      {/* Modern Studio Footer */}
      <footer className="border-t border-white/[0.08] bg-space-950/80 px-6 py-5 text-center backdrop-blur-md">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-4 text-xs font-medium text-slate-400 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
            <span className="text-slate-300 font-semibold">NexusDoc</span>
            <span>·</span>
            <span>PDF research with FAISS and Gemini</span>
          </div>
          <div className="text-slate-400 text-[11px]">
            Built for clear, source-backed document research
          </div>
        </div>
      </footer>
    </div>
  )
}
