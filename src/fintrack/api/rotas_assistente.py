from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from fintrack.api.schemas import PerguntaEntrada, RespostaSaida
from fintrack.api.dependencias import obter_sessao, obter_usuario_atual
from fintrack.analise.assistente import responder

roteador = APIRouter(prefix="/assistente", tags=["Assistente Financeiro"])


@roteador.post("", response_model=RespostaSaida)
def perguntar(
    dados: PerguntaEntrada,
    sessao: Session = Depends(obter_sessao),
    autenticado=Depends(obter_usuario_atual),
):
    _, usuario_id = autenticado
    resposta = responder(sessao, usuario_id, dados.pergunta)
    return RespostaSaida(resposta=resposta)