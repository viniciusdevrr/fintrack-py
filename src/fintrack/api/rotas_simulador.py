from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from fintrack.api.schemas import SimulacaoEntrada, SimulacaoSaida
from fintrack.api.dependencias import obter_sessao, obter_usuario_atual
from fintrack.analise import simulador

roteador = APIRouter(prefix="/simulador", tags=["Simulador"])


@roteador.post("", response_model=SimulacaoSaida)
def simular(
    dados: SimulacaoEntrada,
    sessao: Session = Depends(obter_sessao),
    autenticado=Depends(obter_usuario_atual),
):
    _, usuario_id = autenticado
    try:
        resultado = simulador.simular_gasto(sessao, usuario_id, dados.valor, dados.categoria)
    except ValueError as erro:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(erro))

    return SimulacaoSaida(**resultado)