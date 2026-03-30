import cohere
from api.models.response import LegalMetadata, SearchResultChunk
from api.core.logger import get_logger

logger = get_logger(__name__)

def rerank_documents(cohere_client: cohere.ClientV2, original_query: str, doc_texts: list, top_k: int, raw_results):
    rerank_response = cohere_client.rerank(
        model="rerank-v3.5",
        query=original_query,
        documents=doc_texts,
        top_n=top_k
    )
    
    logger.info(f"Cohere reranking complete. Extracting Top {top_k} results:")
    safe_matches = []
    # We use enumerate to get the actual 1st, 2nd, 3rd place ranking for the logs
    for rank, ranked_item in enumerate(rerank_response.results, start=1):
        
        original_match = raw_results.matches[ranked_item.index]
        metadata_obj = LegalMetadata(**original_match.metadata)
        
        chunk = SearchResultChunk(
            id=original_match.id,
            score=ranked_item.relevance_score, 
            metadata=metadata_obj
        )
        safe_matches.append(chunk)
        
        # 3. The Ultimate Debug Log
        # Shows the Rank, New Score, Old Score, Law ID, and Title!
        logger.info(
            f"  Rank {rank} | "
            f"New Score: {ranked_item.relevance_score:.4f} (Pinecone: {original_match.score:.4f}) | "
            f"ID: {metadata_obj.law_id} | Title: {metadata_obj.title[:60]}..."
        )