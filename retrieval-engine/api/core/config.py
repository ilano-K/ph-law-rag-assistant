from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = 'PH LAW RETRIEVAL API'
    ENVIRONMENT: str = 'development'
    
    # PINECONE
    PINECONE_API_KEY: str
    PINECONE_INDEX_NAME: str
    
    # Read env file
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8')
    
settings = Settings()