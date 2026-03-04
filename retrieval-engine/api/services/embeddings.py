from pinecone_text.sparse import BM25Encoder
from sentence_transformers import SentenceTransformer
from pathlib import Path
import torch


BASE_DIR = Path(__file__).resolve().parent.parent.parent
BM25_PATH = BASE_DIR / "data" / "bm25_weights.json"

bm25 = BM25Encoder()
bm25.load(BM25_PATH)

device = 'cuda' if torch.cuda.is_available() else 'cpu'
dense_model = SentenceTransformer('jinaai/jina-embeddings-v2-base-en', trust_remote_code=True)
dense_model.to(device)

def generate_hybrid_vectors(query: str):
    # Generate dense vector
    with torch.inference_mode():
        dense_vector = dense_model.encode(query, convert_to_numpy=True).tolist()
        
    # Generate sparse vector
    sparse_vector = bm25.encode_queries(query)
    
    return dense_vector, sparse_vector