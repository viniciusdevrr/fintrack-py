from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from fintrack.api.schemas import CategoriaCriar, CategoriaSaida
from fintrack.api.dependencias import obter_sessao, obter_usuario_atual
from fintrack.modelos.categoria import Categoria
from fintrack.repositorio import repositorio_categoria as repo
from fintrack.excecoes import FinTrackError

roteador = APIRouter(prefix="/categorias", tags=["Categorias"])


@roteador.post("", response_model=CategoriaSaida, status_code=status.HTTP_201_CREATED)
def criar_categoria(
    dados: CategoriaCriar,
    sessao: Session = Depends(obter_sessao),
    autenticado=Depends(obter_usuario_atual),
):
    _, usuario_id = autenticado
    try:
        categoria = Categoria(dados.nome, dados.tipo, dados.limite_mensal)
        categoria_id = repo.salvar(sessao, categoria, usuario_id)
    except FinTrackError as erro:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(erro))

    return CategoriaSaida(
        id=categoria_id, nome=categoria.nome, tipo=categoria.tipo, limite_mensal=categoria.limite_mensal
    )


@roteador.get("", response_model=list[CategoriaSaida])
def listar_categorias(
    sessao: Session = Depends(obter_sessao),
    autenticado=Depends(obter_usuario_atual),
):
    _, usuario_id = autenticado
    categorias = repo.listar_todas(sessao, usuario_id)
    return [
        CategoriaSaida(id=0, nome=c.nome, tipo=c.tipo, limite_mensal=c.limite_mensal)
        for c in categorias
    ]