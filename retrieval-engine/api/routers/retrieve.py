from fastapi import APIRouter
from api.models.request import RAGRequest
from api.services.retrieval import process_retrieval_request
from api.core.logger import get_logger

router = APIRouter()
logger = get_logger(__name__)

@router.post('/retrieve')
def retrieve_documents(request: RAGRequest):
    logger.info(f"Retrieval request has been received | query={request.query_text}")
    return process_retrieval_request(request)

