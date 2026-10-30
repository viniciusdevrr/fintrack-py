from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from fintrack.api.schemas import MetaCriar, MetaAportar, MetaSaida, MetaAtualizar 
from fintrack.api.dependencias import obter_sessao, obter_usuario_atual
from fintrack.modelos.meta import Meta
from fintrack.repositorio import repositorio_meta as repo
from fintrack.excecoes import FinTrackError

roteador = APIRouter(prefix="/metas", tags=["Metas"])


@roteador.post("", response_model=MetaSaida, status_code=status.HTTP_201_CREATED)
def criar_meta(
    dados: MetaCriar,
    sessao: Session = Depends(obter_sessao),
    autenticado=Depends(obter_usuario_atual),
):
    _, usuario_id = autenticado
    try:
        meta = Meta(dados.nome, dados.valor_alvo, dados.data_limite)
        meta_id = repo.salvar(sessao, meta, usuario_id)
    except FinTrackError as erro:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(erro))
    return _para_schema(meta_id, meta)


@roteador.get("", response_model=list[MetaSaida])
def listar_metas(sessao: Session = Depends(obter_sessao), autenticado=Depends(obter_usuario_atual)):
    _, usuario_id = autenticado
    return [_para_schema(mid, m) for mid, m in repo.listar_todas(sessao, usuario_id)]


def _para_schema(meta_id: int, meta: Meta) -> MetaSaida:
    return MetaSaida(
        id=meta_id,
        nome=meta.nome,
        valor_alvo=meta.valor_alvo,
        valor_atual=meta.valor_atual,
        progresso_percentual=meta.progresso_percentual,
        concluida=meta.concluida,
    )


@roteador.put("/{meta_id}", response_model=MetaSaida)
def atualizar_meta(
    meta_id: int,
    dados: MetaAtualizar,
    sessao: Session = Depends(obter_sessao),
    autenticado=Depends(obter_usuario_atual),
):
    _, usuario_id = autenticado
    campos_enviados = dados.model_dump(exclude_unset=True)
    try:
        atualizado = repo.atualizar(
            sessao, meta_id, usuario_id,
            nome=dados.nome, valor_alvo=dados.valor_alvo,
            data_limite=dados.data_limite,
            data_limite_informada="data_limite" in campos_enviados,
        )
    except FinTrackError as erro:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(erro))

    if atualizado is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Meta não encontrada.")

    meta = repo.buscar_por_id(sessao, meta_id, usuario_id)
    return _para_schema(meta_id, meta)


@roteador.delete("/{meta_id}", status_code=status.HTTP_204_NO_CONTENT)
def excluir_meta(
    meta_id: int,
    sessao: Session = Depends(obter_sessao),
    autenticado=Depends(obter_usuario_atual),
):
    _, usuario_id = autenticado
    if not repo.excluir(sessao, meta_id, usuario_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Meta não encontrada.")


@roteador.post("/{meta_id}/aportar", response_model=MetaSaida)
def aportar_meta(
    meta_id: int,
    dados: MetaAportar,
    sessao: Session = Depends(obter_sessao),
    autenticado=Depends(obter_usuario_atual),
):
    _, usuario_id = autenticado
    try:
        meta = repo.aportar(sessao, meta_id, usuario_id, dados.valor)
    except FinTrackError as erro:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(erro))

    if meta is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Meta não encontrada.")

    return _para_schema(meta_id, meta)