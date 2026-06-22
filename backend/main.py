from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.apis.solicitud_api import router as solicitud_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4200",
        "http://127.0.0.1:4200",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def inicio():
    return {"mensaje": "Backend funcionando"}


app.include_router(solicitud_router)
