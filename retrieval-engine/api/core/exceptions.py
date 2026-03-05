class BaseAppException(Exception):
    def __init__(self, message: str, status_code: int, error_code: str, details: list = None):
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        self.details = details or []

class EmptyQueryError(BaseAppException):
    def __init__(self):
        super().__init__(
            message='Search query cannot be empty.',
            status_code=400, 
            error_code='EMPTY_QUERY'
        )

class NoRelevantLawsFoundError(BaseAppException):
    def __init__(self):
        super().__init__(
            message="Couldn't find any specific Philippine Republic Acts relative to your query. ", 
            status_code=404,
            error_code='NO_LAWS_FOUND',
        )

class DatabaseTimeoutError(BaseAppException):
    def __init__(self):
        super().__init__(
            message="Database is taking too long to respond. Please try your search again in a few seconds.", 
            status_code=504,
            error_code='DATABASE_TIMEOUT'
        )

class EmbeddingGenerationError(BaseAppException):
    def __init__(self):
        super().__init__(
            message="An issue has been encountered while processing your query.",
            status_code=500,
            error_code="EMBEDDING_FAILED"
        )