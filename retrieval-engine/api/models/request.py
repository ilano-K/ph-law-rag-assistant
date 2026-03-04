from pydantic import BaseModel, Field
from typing import Dict, Optional, Any 

class RAGRequest(BaseModel):
    query_text: str
    top_k: int = Field(
        default=5,
        ge=1,
        le=20,
        description='max number of chunks to return'
    )
    alpha: float = Field(
        default=0.5,
        ge=0.0,
        le=1.0
    )
    filters: Optional[Dict[str, Any]] = Field(
        default=None,
        description='Optional Pinecone metadata filters'
    )