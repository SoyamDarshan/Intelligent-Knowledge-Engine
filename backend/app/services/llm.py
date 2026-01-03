from abc import ABC, abstractmethod
from typing import AsyncGenerator
from langchain_community.chat_models import ChatOllama
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from app.core.config import settings

class LLMProvider(ABC):
    @abstractmethod
    async def chat_stream(self, prompt: str, history: list) -> AsyncGenerator[str, None]:
        pass

class OllamaProvider(LLMProvider):
    def __init__(self, model: str = settings.DEFAULT_MODEL):
        self.llm = ChatOllama(
            base_url=settings.OLLAMA_BASE_URL,
            model=model
        )

    async def chat_stream(self, prompt: str, history: list) -> AsyncGenerator[str, None]:
        # Simple conversion of history - in production, map this properly to LangChain messages
        messages = [SystemMessage(content="You are a helpful AI assistant empowered with RAG capabilities.")]
        for msg in history:
            # Assuming history is list of dicts {role: "user"|"agent", content: "..."}
            if msg.get("role") == "user":
                messages.append(HumanMessage(content=msg.get("content")))
            # Add AI history if needed
        
        messages.append(HumanMessage(content=prompt))
        
        async for chunk in self.llm.astream(messages):
            yield chunk.content

class OpenAIProvider(LLMProvider):
    def __init__(self, model: str = "gpt-4-turbo"):
        self.llm = ChatOpenAI(api_key=settings.OPENAI_API_KEY, model=model)

    async def chat_stream(self, prompt: str, history: list) -> AsyncGenerator[str, None]:
        messages = [SystemMessage(content="You are a helpful AI assistant.")]
        # Mapping history...
        messages.append(HumanMessage(content=prompt))
        
        async for chunk in self.llm.astream(messages):
            yield chunk.content

def get_llm_provider(provider_type: str = "ollama", model: str = None) -> LLMProvider:
    if provider_type == "openai":
        return OpenAIProvider(model=model or "gpt-4")
    return OllamaProvider(model=model or settings.DEFAULT_MODEL)
