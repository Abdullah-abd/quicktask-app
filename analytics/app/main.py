from fastapi import FastAPI
from app.analytics import router as analytics_router

app = FastAPI()

app.include_router(analytics_router, prefix="/analytics")

@app.get("/")
def root():
    return {"message": "Analytics Service Running"}
