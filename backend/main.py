"""
main.py — FastAPI entry point for NexusDoc AI
Endpoints: GET /api/health, POST /api/upload, POST /api/query
"""

import shutil
import traceback
from pathlib import Path

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

from rag import rebuild_index, answer_question

# ── Paths ─────────────────────────────────────────────────────────────────────
DOCUMENTS_DIR = Path(__file__).parent.parent / "documents"
DOCUMENTS_DIR.mkdir(exist_ok=True)

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="NexusDoc AI — Neural RAG API",
    description="Backend service for PDF parsing, FAISS vector indexing, and Gemini-grounded question answering."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Health ────────────────────────────────────────────────────────────────────
@app.get("/api/health")
def health():
    return {"status": "ok", "service": "NexusDoc AI Engine"}


# ── Upload ────────────────────────────────────────────────────────────────────
@app.post("/api/upload")
async def upload(files: List[UploadFile] = File(...)):
    """
    Accept one or more PDFs, save them, and ingest into FAISS.
    Returns the list of processed filenames.
    """
    processed = []
    saved_paths = []
    for file in files:
        original_name = file.filename or ""
        safe_name = Path(original_name).name
        if not safe_name or not safe_name.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail=f"{original_name or 'Uploaded file'} is not a PDF.")

        dest = DOCUMENTS_DIR / safe_name
        with dest.open("wb") as f:
            shutil.copyfileobj(file.file, f)

        if dest.stat().st_size == 0:
            dest.unlink(missing_ok=True)
            raise HTTPException(status_code=400, detail=f"'{safe_name}' is empty.")

        processed.append(safe_name)
        saved_paths.append(str(dest))

    try:
        rebuild_index(saved_paths)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to index uploaded documents: {str(e)}"
        )

    return {"message": "Uploaded and indexed successfully.", "files": processed}


# ── Query ─────────────────────────────────────────────────────────────────────
class QueryRequest(BaseModel):
    question: str


@app.post("/api/query")
def query(req: QueryRequest):
    """
    Accept a natural language question.
    Returns the generated answer and the retrieved source chunks.
    """
    if not req.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    try:
        result = answer_question(req.question)
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")
