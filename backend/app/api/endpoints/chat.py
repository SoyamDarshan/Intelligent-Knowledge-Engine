from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.services.llm import get_llm_provider
from app.services.vector_store import vector_store

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    history: list = []
    model: str = None
    use_rag: bool = True

@router.post("/")
async def chat(request: ChatRequest):
    try:
        context = ""
        if request.use_rag:
            # 1. Retrieve context
            results = await vector_store.search(request.message)
            context = "\n".join([f"Source ({r['meta'].get('source')}): {r['content']}" for r in results])
        
        # 2. Augment Prompt
        if context:
            augmented_prompt = f"Context:\n{context}\n\nQuestion: {request.message}\nAnswer based on context if relevant."
        else:
            augmented_prompt = request.message

        # 3. Stream Response
        provider = get_llm_provider(model=request.model)
        
        return StreamingResponse(
            provider.chat_stream(augmented_prompt, request.history),
            media_type="text/event-stream"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
