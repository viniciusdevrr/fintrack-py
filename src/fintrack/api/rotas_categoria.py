from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from fintrack.api.schemas import CategoriaCriar, CategoriaSaida, CategoriaAtualizar
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
def listar_categorias(sessao: Session = Depends(obter_sessao), autenticado=Depends(obter_usuario_atual)):
    _, usuario_id = autenticado
    return [
        CategoriaSaida(id=cid, nome=c.nome, tipo=c.tipo, limite_mensal=c.limite_mensal)
        for cid, c in repo.listar_todas(sessao, usuario_id)
    ]


@roteador.put("/{categoria_id}", response_model=CategoriaSaida)
def atualizar_categoria(
    categoria_id: int,
    dados: CategoriaAtualizar,
    sessao: Session = Depends(obter_sessao),
    autenticado=Depends(obter_usuario_atual),
):
    _, usuario_id = autenticado
    campos_enviados = dados.model_dump(exclude_unset=True)
    try:
        atualizado = repo.atualizar(
            sessao, categoria_id, usuario_id,
            nome=dados.nome, tipo=dados.tipo,
            limite_mensal=dados.limite_mensal,
            limite_informado="limite_mensal" in campos_enviados,
        )
    except FinTrackError as erro:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(erro))

    if atualizado is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Categoria não encontrada.")

    categoria = repo.buscar_por_id(sessao, categoria_id, usuario_id)
    return CategoriaSaida(id=categoria_id, nome=categoria.nome, tipo=categoria.tipo, limite_mensal=categoria.limite_mensal)


@roteador.delete("/{categoria_id}", status_code=status.HTTP_204_NO_CONTENT)
def excluir_categoria(
    categoria_id: int,
    sessao: Session = Depends(obter_sessao),
    autenticado=Depends(obter_usuario_atual),
):
    _, usuario_id = autenticado
    excluido = repo.excluir(sessao, categoria_id, usuario_id)
    if not excluido:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Categoria não encontrada.")