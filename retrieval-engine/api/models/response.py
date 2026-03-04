from pydantic import BaseModel, Field
from typing import Optional, Literal, List

# Available metadata fields
class LegalMetadata(BaseModel):
    chunk_index: str 
    law_id: str 
    document_type : Literal['republic_act'] 
    date_approved: str 
    title: str 
    source_url: str 

# Chunk
class SearchResultChunk(BaseModel):
    id: str 
    score: float = Field(description='Similarity Score')
    metadata: LegalMetadata

# The response including query + chunks
class HybridSearchResponse(BaseModel):
    query: str = Field(description='Echo the original query')
    results: List[LegalMetadata] = Field(default_factory=List)
    