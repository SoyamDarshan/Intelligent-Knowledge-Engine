from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "RAG Agent Interface"
    
    # Vector DB
    QDRANT_HOST: str = "qdrant"
    QDRANT_PORT: int = 6333
    QDRANT_COLLECTION: str = "documents"
    
    # LLM Settings
    DEFAULT_MODEL: str = "llama3" 
    OLLAMA_BASE_URL: str = "http://ollama:11434"
    OPENAI_API_KEY: str = ""
    
    # Message Queue
    REDIS_URL: str = "redis://redis:6379/0"

    class Config:
        env_file = ".env"

settings = Settings()
