from pinecone import Pinecone 
import cohere
from api.core.config import settings
from api.models.response import HybridSearchResponse, SearchResultChunk, LegalMetadata
from api.models.request import RAGRequest
from api.services.embeddings import generate_hybrid_vectors
from fastapi import HTTPException
from api.core.logger import get_logger
from api.core.exceptions import BaseAppException, EmptyQueryError, NoRelevantLawsFoundError, DatabaseTimeoutError

logger = get_logger(__name__)

pc = Pinecone(api_key=settings.PINECONE_API_KEY)
index = pc.Index(settings.PINECONE_INDEX_NAME)

def hybrid_scale(dense_vec, sparse_vec, alpha: float):
    if alpha < 0 or alpha > 1:
        raise ValueError("Alpha must be between 0 and 1")
    hdense = [v * alpha for v in dense_vec]
    hsparse = {
        'indices': sparse_vec['indices'],
        'values': [v * (1 - alpha) for v in sparse_vec['values']]
    }
    return hdense, hsparse

def retrieve_chunks(top_k: int, dense_vec, sparse_vec, alpha=0.5):
    hdense, hsparse = hybrid_scale(dense_vec, sparse_vec, alpha)
    try:
        results = index.query(
            vector=hdense,
            sparse_vector=hsparse,
            top_k=top_k,
            include_metadata=True,
        )
    except:
        raise DatabaseTimeoutError()
    if not results.matches:
           raise  NoRelevantLawsFoundError()
        
    best_score = results.matches[0].score 
    if best_score < 0.15:
        raise NoRelevantLawsFoundError()
    return results 

def process_retrieval_request(request: RAGRequest, cohere_client: cohere.ClientV2):
    if not request.query_text.strip():
        raise EmptyQueryError()
    try:
        logger.info(f"Retrieval started | query='{request.query_text}' | top_k={request.top_k}")
        dense_vec, sparse_vec = generate_hybrid_vectors(request.query_text)
        
        NUMBER_OF_DOCS = 25
        raw_results = retrieve_chunks(NUMBER_OF_DOCS, dense_vec, sparse_vec, request.alpha)
        logger.info(f"Pinecone returned {len(raw_results['matches'])} matches")
        
        doc_texts = [match.metadata.get("text", "") for match in raw_results.matches]
        
        logger.info(f"Cohere reranking {len(doc_texts)} docs against original_query='{request.original_query}'")
        rerank_response = cohere_client.rerank(
            model="rerank-v3.5",
            query=request.original_query,
            documents=doc_texts,
            top_n=request.top_k
        )
        
        logger.info(f"Cohere reranking complete. Extracting Top {request.top_k} results:")
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
        return HybridSearchResponse(
            query=request.query_text,
            results=safe_matches
        )
    except BaseAppException as e:
        logger.warning(f"Business logic error triggered: {e.error_code}")
        raise e 
        
    except Exception as e:
        logger.exception(f"Unexpected retrieval failure | query='{request.query_text}'")
        raise e