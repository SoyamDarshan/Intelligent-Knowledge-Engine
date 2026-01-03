import requests
import os

# Configuration
BASE_URL = "http://localhost:8000"
TEST_FILE_CONTENT = "This is a test document for the RAG agent ingestion pipeline."
TEST_FILENAME = "test_doc.txt"

def test_health():
    """Test if backend is running."""
    try:
        # Assuming there's a docs endpoint or similar, but let's try root or a known endpoint
        response = requests.get(f"{BASE_URL}/docs")
        if response.status_code == 200:
            print("✅ Backend is reachable")
        else:
            print(f"❌ Backend returned {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to backend")

def test_ingestion():
    """Test file upload and ingestion."""
    # Create a dummy file
    with open(TEST_FILENAME, "w") as f:
        f.write(TEST_FILE_CONTENT)
    
    try:
        with open(TEST_FILENAME, "rb") as f:
            files = {"file": (TEST_FILENAME, f, "text/plain")}
            response = requests.post(f"{BASE_URL}/api/ingest/", files=files)
            
        if response.status_code == 200:
            print(f"✅ Ingestion Endpoint Success: {response.json()}")
        else:
            print(f"❌ Ingestion Failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Test Error: {e}")
    finally:
        # Cleanup
        if os.path.exists(TEST_FILENAME):
            os.remove(TEST_FILENAME)

def test_chat():
    """Test simple chat interaction."""
    payload = {
        "message": "What is this test document about?",
        "history": []
    }
    try:
        response = requests.post(f"{BASE_URL}/api/chat/", json=payload, stream=True)
        if response.status_code == 200:
            print("✅ Chat Endpoint Reachable. Response stream:")
            # Just read first few bytes to verify stream
            for chunk in response.iter_content(chunk_size=128):
                if chunk:
                    print(f"   Received chunk: {chunk.decode()[:50]}...")
                    break
        else:
            print(f"❌ Chat Failed: {response.text}")
    except Exception as e:
        print(f"❌ Chat Test Error: {e}")

if __name__ == "__main__":
    print(f"Testing Backend at {BASE_URL}...")
    test_health()
    test_ingestion()
    test_chat()
