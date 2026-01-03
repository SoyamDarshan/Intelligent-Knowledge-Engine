from qdrant_client import QdrantClient
from qdrant_client.http import models
from app.core.config import settings
from langchain_community.embeddings import OllamaEmbeddings

class VectorStoreService:
    def __init__(self):
        self.client = QdrantClient(host=settings.QDRANT_HOST, port=settings.QDRANT_PORT)
        # Using Ollama for embeddings for now to keep it local/free
        self.embeddings = OllamaEmbeddings(base_url=settings.OLLAMA_BASE_URL, model="nomic-embed-text")

    def ensure_collection(self):
        collections = self.client.get_collections()
        exists = any(c.name == settings.QDRANT_COLLECTION for c in collections.collections)
        if not exists:
            self.client.create_collection(
                collection_name=settings.QDRANT_COLLECTION,
                vectors_config=models.VectorParams(size=768, distance=models.Distance.COSINE), # nomic-embed-text is 768
            )

    async def embed_and_store(self, text: str, meta: dict):
        # This calls the embedding model
        import uuid
        self.ensure_collection()
        vector = self.embeddings.embed_query(text)
        
        self.client.upsert(
            collection_name=settings.QDRANT_COLLECTION,
            points=[
                models.PointStruct(
                    id=uuid.uuid4().hex,
                    vector=vector,
                    payload={"content": text, **meta}
                )
            ]
        )

    async def search(self, query: str, limit: int = 3):
        self.ensure_collection()
        query_vector = self.embeddings.embed_query(query)
        hits = self.client.search(
            collection_name=settings.QDRANT_COLLECTION,
            query_vector=query_vector,
            limit=limit
        )
        return [{"content": hit.payload["content"], "score": hit.score, "meta": hit.payload} for hit in hits]

vector_store = VectorStoreService()
