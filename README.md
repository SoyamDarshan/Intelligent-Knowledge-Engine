# I.K.E. - Intelligent Knowledge Engine  
**"I Know Everything You Tell Me"**

I.K.E. is a high-performance, agentic RAG (Retrieval-Augmented Generation) interface designed for private, local, and scalable knowledge management. Built with a stunning **Midnight Violet** aesthetic, it provides a premium experience for interacting with your own data.

![I.K.E. UI Mockup](./docs/presentation/ike_ui_mockup.png)

## 🌟 What it Does
I.K.E. transforms static documents (PDFs, Text) into an interactive neural core.
- **Neural Ingestion**: Instant local parsing and vectorization of your files.
- **Semantic Retrieval**: Uses state-of-the-art embeddings to find exactly what you're looking for.
- **Agentic Chat**: Streams responses from local LLMs (Llama 3) or Cloud APIs (OpenAI).
- **Infinite Memory**: Every document you upload makes I.K.E. smarter about your specific knowledge base.

## 🚀 Use Cases
1.  **Private Personal Assistant**: Index your personal notes, books, and receipts without data leaving your machine (via Ollama).
2.  **Dev-Ops Documentation Hub**: Upload complex documentation and skip the search bar—just ask the code.
3.  **Legal & Compliance**: Rapidly query thousands of pages of contracts for specific clauses.
4.  **Academic Researcher**: Link your library of papers and cross-reference themes across multiple documents.

## 🛠️ How to Run & Set Up

### Prerequisites
- **Docker & Docker Compose V2**
- **WSL2** (If on Windows)
- **Git**

### 📦 Initial Local Setup
1.  **Clone or Initialize**:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```

2.  **Launch the Stack**:
    ```bash
    # Launch all services (DB, LLM, API, UI)
    docker-compose up -d --build
    ```

3.  **Prepare Models**:
    ```bash
    # Pull the required models in the Ollama container
    docker-compose exec ollama ollama pull llama3
    docker-compose exec ollama ollama pull nomic-embed-text
    ```

### 🔗 Connecting to GitHub
To push this project to a new GitHub repository:

1.  **Create a Repository**: Go to [GitHub](https://github.com/new) and create a new repository (empty, no README/License).
2.  **Add Remote**:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    ```
3.  **Rename Branch** (Optional but recommended):
    ```bash
    git branch -M main
    ```
4.  **Push Code**:
    ```bash
    git push -u origin main
    ```

### 🌐 Access
- **Frontend UI**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000/docs](http://localhost:8000/docs)

## 📈 Scalability & Future Roadmap

### How to Scale This
- **Distributed Workers**: Swap the `BackgroundTasks` for a distributed **Celery** or **Arroyo** cluster to handle massive document ingestion.
- **Orchestration**: Deploy Qdrant in a distributed cluster mode for horizontal scaling of vector search.
- **Caching Layer**: Implement a **Redis Semantic Cache** to serve repeated queries instantly without hitting the LLM.
- **Multi-Tenant**: Add JWT authentication to provide private knowledge bases for different users.

### Planned Improvements
- [ ] **Multi-Format Support**: Integration for Word, Excel, and Markdown.
- [ ] **Source Citations**: Visual links back to exactly which page and line a response came from.
- [ ] **Graph-RAG**: Connecting entities across documents to show relational insights.
- [ ] **Voice Interface**: Real-time STT/TTS for hands-free intelligence.

