from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import chat, ingest

app = FastAPI(title="RAG Agent API")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(ingest.router, prefix="/api/ingest", tags=["ingest"])

@app.get("/")
async def root():
    return {"message": "RAG Agent API is running"}
