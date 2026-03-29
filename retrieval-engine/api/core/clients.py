import cohere
from api.core.config import settings

_cohere_client = cohere.ClientV2(settings.COHERE_API_KEY)

def get_cohere_client() -> cohere.ClientV2:
    return _cohere_client