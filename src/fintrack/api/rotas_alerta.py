from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from fintrack.api.schemas import AlertaSaida
from fintrack.api.dependencias import obter_sessao, obter_usuario_atual
from fintrack.servicos import servico_orcamento
from fintrack.repositorio import repositorio_alerta as repo

roteador = APIRouter(prefix="/alertas", tags=["Alertas"])


@roteador.post("/verificar", response_model=list[AlertaSaida])
def verificar_orcamento(
    sessao: Session = Depends(obter_sessao),
    autenticado=Depends(obter_usuario_atual),
):
    """Roda a checagem de orçamento agora e devolve só os alertas NOVOS gerados."""
    _, usuario_id = autenticado
    alertas = servico_orcamento.verificar_orcamentos(sessao, usuario_id)
    return [AlertaSaida(tipo=a.tipo, mensagem=a.mensagem, lido=a.lido) for a in alertas]


@roteador.get("", response_model=list[AlertaSaida])
def listar_alertas(
    sessao: Session = Depends(obter_sessao),
    autenticado=Depends(obter_usuario_atual),
):
    """Lista todos os alertas não lidos do usuário (histórico acumulado)."""
    _, usuario_id = autenticado
    alertas = repo.listar_nao_lidos(sessao, usuario_id)
    return [AlertaSaida(tipo=a.tipo, mensagem=a.mensagem, lido=a.lido) for a in alertas]