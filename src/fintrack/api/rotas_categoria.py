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
    usuario=Depends(obter_usuario_atual),  # exige login, mesmo sem usar o valor
):
    try:
        categoria = Categoria(dados.nome, dados.tipo, dados.limite_mensal)
        categoria_id = repo.salvar(sessao, categoria)
    except FinTrackError as erro:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(erro))

    return CategoriaSaida(
        id=categoria_id, nome=categoria.nome, tipo=categoria.tipo, limite_mensal=categoria.limite_mensal
    )


@roteador.get("", response_model=list[CategoriaSaida])
def listar_categorias(
    sessao: Session = Depends(obter_sessao),
    usuario=Depends(obter_usuario_atual),
):
    categorias = repo.listar_todas(sessao)
    # O id não faz parte do objeto de domínio Categoria (igual vimos com Usuario),
    # então por enquanto devolvemos sem id aqui — vamos resolver isso de forma
    # definitiva ao ligar Categoria a um usuário dono, próxima iteração.
    return [
        CategoriaSaida(id=0, nome=c.nome, tipo=c.tipo, limite_mensal=c.limite_mensal)
        for c in categorias
    ]