from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from fintrack.api.schemas import MetaCriar, MetaAportar, MetaSaida
from fintrack.api.dependencias import obter_sessao, obter_usuario_atual
from fintrack.modelos.meta import Meta
from fintrack.repositorio import repositorio_meta as repo
from fintrack.excecoes import FinTrackError

roteador = APIRouter(prefix="/metas", tags=["Metas"])


@roteador.post("", response_model=MetaSaida, status_code=status.HTTP_201_CREATED)
def criar_meta(
    dados: MetaCriar,
    sessao: Session = Depends(obter_sessao),
    usuario=Depends(obter_usuario_atual),
):
    try:
        meta = Meta(dados.nome, dados.valor_alvo, dados.data_limite)
        meta_id = repo.salvar(sessao, meta)
    except FinTrackError as erro:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(erro))

    return _para_schema(meta_id, meta)


@roteador.get("", response_model=list[MetaSaida])
def listar_metas(
    sessao: Session = Depends(obter_sessao),
    usuario=Depends(obter_usuario_atual),
):
    return [_para_schema(0, m) for m in repo.listar_todas(sessao)]


def _para_schema(meta_id: int, meta: Meta) -> MetaSaida:
    return MetaSaida(
        id=meta_id,
        nome=meta.nome,
        valor_alvo=meta.valor_alvo,
        valor_atual=meta.valor_atual,
        progresso_percentual=meta.progresso_percentual,
        concluida=meta.concluida,
    )