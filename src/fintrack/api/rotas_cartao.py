from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from fintrack.api.schemas import CartaoCriar, CartaoSaida
from fintrack.api.dependencias import obter_sessao, obter_usuario_atual
from fintrack.modelos.cartao import Cartao
from fintrack.repositorio import repositorio_cartao as repo
from fintrack.excecoes import FinTrackError

roteador = APIRouter(prefix="/cartoes", tags=["Cartões"])


@roteador.post("", response_model=CartaoSaida, status_code=status.HTTP_201_CREATED)
def criar_cartao(
    dados: CartaoCriar,
    sessao: Session = Depends(obter_sessao),
    autenticado=Depends(obter_usuario_atual),
):
    _, usuario_id = autenticado
    try:
        cartao = Cartao(dados.nome, dados.limite, dados.dia_fechamento, dados.dia_vencimento)
        cartao_id = repo.salvar(sessao, cartao, usuario_id)
    except FinTrackError as erro:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(erro))

    return CartaoSaida(
        id=cartao_id, nome=cartao.nome, limite=cartao.limite,
        fatura_atual=0.0, limite_disponivel=cartao.limite,
    )


@roteador.get("", response_model=list[CartaoSaida])
def listar_cartoes(
    sessao: Session = Depends(obter_sessao),
    autenticado=Depends(obter_usuario_atual),
):
    _, usuario_id = autenticado
    cartoes = repo.listar_todos(sessao, usuario_id)
    return [
        CartaoSaida(
            id=0, nome=c.nome, limite=c.limite,
            fatura_atual=c.fatura_atual, limite_disponivel=c.limite_disponivel,
        )
        for c in cartoes
    ]