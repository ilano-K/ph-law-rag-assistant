from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from api.routers.retrieve import router as retrieve_router
from api.core.exceptions import BaseAppException

app = FastAPI(title='retrieval engine')
app.include_router(retrieve_router, prefix='/api/v1')

@app.exception_handler(BaseAppException)
async def custom_app_exception_handler(request: Request, exc: BaseAppException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={
            'status': 'error',
            'error_code': exc.error_code,
            'message': exc.message,
            'details': exc.details,
        }
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    details = [{"field": " -> ".join([str(x) for x in err["loc"]]), "issue": err["msg"]} for err in exc.errors()]
    return JSONResponse(
        status_code=422,
        content={
            "status": "error",
            "error_code": "VALIDATION_ERROR",
            "message": "The request payload is invalid or missing required fields.",
            "details": details
        }
    )

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "status": "error",
            "error_code": "HTTP_ERROR",
            "message": exc.detail,
            "details": []
        }
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "error_code": "INTERNAL_SERVER_ERROR",
            "message": "An unexpected system error occurred. Our team has been notified.",
            "details": []
        }
    )