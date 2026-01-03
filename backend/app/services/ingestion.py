import shutil
import os
from fastapi import UploadFile
from app.services.vector_store import vector_store
from langchain_community.document_loaders import PyPDFLoader, TextLoader

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class IngestionService:
    async def process_file_path(self, file_path: str, filename: str):
        # Determine loader
        if filename.endswith(".pdf"):
            loader = PyPDFLoader(file_path)
        else:
            loader = TextLoader(file_path)
            
        # Load and split
        try:
            pages = loader.load_and_split()
            
            # Embed and store
            for page in pages:
                await vector_store.embed_and_store(
                    text=page.page_content,
                    meta={"source": filename, "page": page.metadata.get("page", 0)}
                )
            return len(pages)
        except Exception as e:
            print(f"Error processing {filename}: {e}")
            return 0

ingestion_service = IngestionService()
