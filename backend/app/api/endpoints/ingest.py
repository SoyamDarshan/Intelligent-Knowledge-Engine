from fastapi import APIRouter, UploadFile, File, BackgroundTasks
from app.services.ingestion import ingestion_service

router = APIRouter()

@router.post("/")
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    # Save file immediately while it's open
    import os
    import shutil
    
    UPLOAD_DIR = "uploads"
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Pass the PATH to the background task, not the file object
    background_tasks.add_task(ingestion_service.process_file_path, file_path, file.filename)
    
    return {"message": "File received and processing started", "filename": file.filename}
