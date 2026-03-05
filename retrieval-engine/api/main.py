from fastapi import FastAPI
from api.routers.retrieve import router as retrieve_router

app = FastAPI(title='retrieval engine')
app.include_router(retrieve_router, prefix='/api/v1')

@app.get('/api/v1/health')
def health_check():
    return {'message': 'API IS ALIVE LEZGO'}