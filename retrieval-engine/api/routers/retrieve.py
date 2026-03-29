from fastapi import APIRouter, Depends
from api.core.clients import get_cohere_client
import cohere
from api.models.request import RAGRequest
from api.services.retrieval import process_retrieval_request
from api.core.logger import get_logger

router = APIRouter()
logger = get_logger(__name__)

@router.post('/retrieve')
def retrieve_documents(request: RAGRequest, cohere_client: cohere.ClientV2 = Depends(get_cohere_client)):
    logger.info(f"Retrieval request has been received | query={request.query_text}")
    return process_retrieval_request(request, cohere_client=cohere_client)

