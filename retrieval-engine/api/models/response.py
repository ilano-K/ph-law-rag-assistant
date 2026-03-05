from pydantic import BaseModel, Field
from typing import Optional, Literal, List

# Available metadata fields
class LegalMetadata(BaseModel):
    text: str
    chunk_index: int 
    law_id: str 
    document_type : Literal['republic_act'] = Field(description="I'll add more later on (e.g,. Supreme Court Cases)")
    date_approved: str 
    title: str = Field("Title of the document the chunk was based on")
    source_url: str 

# Chunk
class SearchResultChunk(BaseModel):
    id: str 
    score: float = Field(description='Similarity Score')
    metadata: LegalMetadata

# The response including query + chunks
class HybridSearchResponse(BaseModel):
    query: str = Field(description='Echo the original query')
    results: List[SearchResultChunk] = Field(default_factory=list)
    