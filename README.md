# NexusDoc AI — Neural Document Studio

<div align="center">

**Grounded Document Question-Answering System with Semantic Retrieval, FAISS Vector Search & Google Gemini**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?style=flat-square&logo=google)](https://aistudio.google.com)
[![FAISS](https://img.shields.io/badge/Vector_DB-FAISS-blue?style=flat-square)](https://github.com/facebookresearch/faiss)

</div>

---

## 🌟 Overview

**NexusDoc AI** is an intelligent full-stack document question-answering studio that transforms multi-page PDF documents into grounded, verified, and source-backed answers. It extracts page-level text, computes semantic embeddings, retrieves high-similarity context using FAISS, and synthesizes answers using Google Gemini with transparent evidence citations and zero hallucinations.

---

## ✨ Features

- **Multi-PDF Ingestion Bay**: Drag-and-drop or browse multiple PDF documents simultaneously with file validation.
- **Deep Semantic Indexing**: Page-by-page extraction via PyMuPDF and recursive chunking with LangChain splitters.
- **FAISS Vector Engine**: Fast, local vector index with cosine similarity search across high-dimensional document embeddings.
- **Dual Embedding Pipeline**: High-performance local Sentence Transformers embeddings with seamless Google Gemini embedding fallback.
- **Context-Grounded Answers**: Google Gemini synthesis constrained strictly to retrieved context to eliminate hallucinations.
- **Transparent Evidence Cards**: Interactive source inspect view showing originating filenames, page numbers, relevance rank, and exact text chunks.
- **Modern Studio Workspace**: Dark obsidian & cyan aurora design system built with React and Tailwind CSS.
- **Keyboard Productivity**: `Ctrl/Cmd + K` shortcut to immediately focus the neural query composer.
- **Query History & Cache**: Local session history for one-click query reload.

---

## 🧠 Neural Architecture & Flow

```text
       ┌───────────────────────────────┐
       │      PDF Documents Ingest     │
       └──────────────┬────────────────┘
                      │
                      ▼
       ┌───────────────────────────────┐
       │   PyMuPDF Page-by-Page Parse  │
       └──────────────┬────────────────┘
                      │
                      ▼
       ┌───────────────────────────────┐
       │ Recursive Character Chunking  │
       │ (1000 chars, 200 char overlap)│
       └──────────────┬────────────────┘
                      │
                      ▼
       ┌───────────────────────────────┐
       │ Sentence Transformers / Gemini│
       │     Dense Vector Embeddings   │
       └──────────────┬────────────────┘
                      │
                      ▼
       ┌───────────────────────────────┐
       │      FAISS Vector Index       │
       └──────────────┬────────────────┘
                      │
                      ▼
 ┌──────────────┐     │     ┌────────────────────────────────┐
 │ User Inquiry ├─────┴────►│ Top-K Semantic Similarity Search │
 └──────────────┘           └──────────────┬─────────────────┘
                                           │
                                           ▼
                            ┌────────────────────────────────┐
                            │ Google Gemini Grounded Synthesis│
                            └──────────────┬─────────────────┘
                                           │
                                           ▼
                            ┌────────────────────────────────┐
                            │ Verified Response + Citations  │
                            └────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend UI** | React 18, Vite, Tailwind CSS | High-performance interactive studio interface |
| **Icons & Style** | Lucide React, Plus Jakarta Sans | Modern design tokens and sleek icons |
| **Markdown** | React Markdown | Rich rendering for code, lists, and formatted responses |
| **Backend API** | FastAPI, Uvicorn, Pydantic | Asynchronous Python REST endpoints |
| **PDF Extraction** | PyMuPDF (fitz) | Fast, lossless page-by-page text extraction |
| **Text Chunking** | LangChain Text Splitters | Recursive character splitting with context overlap |
| **Vector Search** | Facebook AI Similarity Search (FAISS) | High-performance dense vector index |
| **Embeddings** | Sentence Transformers (`all-MiniLM-L6-v2`) | Local semantic embeddings (with Gemini fallback) |
| **LLM Generation** | Google Gemini (`gemini-2.5-flash`) | Context-constrained grounded reasoning |

---

## 📁 Repository Structure

```text
RAG/
├── backend/
│   ├── main.py              # FastAPI application routes (/health, /upload, /query)
│   ├── rag.py               # Extraction, chunking, FAISS indexing, and Gemini generation
│   ├── requirements.txt     # Python backend dependencies
│   └── .env.example         # Template for environment variables
├── frontend/
│   ├── src/
│   │   ├── components/      # Modular UI components (Header, UploadZone, AnswerCard, etc.)
│   │   ├── services/api.js  # Axios client for backend API communication
│   │   ├── App.jsx          # Workbench state, routing & studio layout
│   │   ├── index.css        # Studio design system tokens and glassmorphism styling
│   │   └── main.jsx         # React application entry point
│   ├── package.json
│   ├── tailwind.config.js   # Custom dark obsidian and cyan aurora palette
│   └── vite.config.js       # Vite dev server and proxy configuration
├── documents/               # Local uploaded PDFs (git-ignored)
├── faiss_index/             # Local persisted FAISS vector index (git-ignored)
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Clone the Repository

```bash
git clone https://github.com/workinpotato/RAG.git
cd RAG
```

### 2. Backend Setup

1. Create and activate a Python virtual environment:

```powershell
# Windows
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Linux / macOS
python3 -m venv .venv
source .venv/bin/activate
```

2. Install backend dependencies:

```bash
pip install -r backend/requirements.txt
```

3. Create your `backend/.env` file and insert your [Google AI Studio API Key](https://aistudio.google.com/app/apikey):

```env
GOOGLE_API_KEY=your_actual_gemini_api_key_here
```

4. Launch the FastAPI backend:

```bash
cd backend
uvicorn main:app --reload --port 8000
```

The API docs are interactively available at `http://localhost:8000/docs`.

---

### 3. Frontend Setup

1. Open a new terminal in the `frontend` folder:

```bash
cd frontend
npm install
npm run dev
```

2. Open `http://localhost:5173` in your browser.

---

## 🔌 API Reference

| Method | Endpoint | Description | Request Payload | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/health` | Healthcheck & system status | None | `{"status": "ok", "service": "NexusDoc AI Engine"}` |
| `POST` | `/upload` | Ingest and index PDFs | `multipart/form-data` with `files` | `{"message": "Uploaded and indexed successfully.", "files": [...]}` |
| `POST` | `/query` | Natural language question | `{"question": "What is the summary?"}` | `{"answer": "...", "sources": [{"source": "doc.pdf", "page": 1, "content": "..."}]}` |

---

## 🛡️ License

This project is licensed under the MIT License.
