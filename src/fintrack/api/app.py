from contextlib import asynccontextmanager
from fastapi import FastAPI

from fintrack.database import criar_tabelas
from fintrack.api.rotas_auth import roteador as roteador_auth
from fintrack.api.rotas_categoria import roteador as roteador_categoria
from fintrack.api.rotas_meta import roteador as roteador_meta


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Tudo antes do "yield" roda quando o servidor SOBE.
    criar_tabelas()
    yield
    # Tudo depois do "yield" rodaria quando o servidor DESLIGA
    # (não precisamos de nada aqui por enquanto).


app = FastAPI(
    title="FinTrack API",
    description="API do aplicativo de finanças pessoais FinTrack.",
    version="0.1.0",
    lifespan=lifespan,
)

app.include_router(roteador_auth)
app.include_router(roteador_categoria)
app.include_router(roteador_meta)


@app.get("/", tags=["Status"])
def raiz():
    return {"status": "FinTrack API no ar"}