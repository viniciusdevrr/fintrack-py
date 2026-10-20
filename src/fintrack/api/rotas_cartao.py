from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from fintrack.api.schemas import CartaoCriar, CartaoSaida, CartaoAtualizar, CompraCartaoEntrada
from fintrack.api.dependencias import obter_sessao, obter_usuario_atual
from fintrack.modelos.cartao import Cartao
from fintrack.repositorio import repositorio_cartao as repo
from fintrack.excecoes import FinTrackError

roteador = APIRouter(prefix="/cartoes", tags=["Cartões"])


def _para_schema(cartao_id: int, cartao: Cartao) -> CartaoSaida:
    return CartaoSaida(
        id=cartao_id, nome=cartao.nome, limite=cartao.limite,
        fatura_atual=cartao.fatura_atual, limite_disponivel=cartao.limite_disponivel,
    )


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
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(erro))

    return _para_schema(cartao_id, cartao)


@roteador.get("", response_model=list[CartaoSaida])
def listar_cartoes(sessao: Session = Depends(obter_sessao), autenticado=Depends(obter_usuario_atual)):
    _, usuario_id = autenticado
    return [_para_schema(cid, c) for cid, c in repo.listar_todos(sessao, usuario_id)]


@roteador.put("/{cartao_id}", response_model=CartaoSaida)
def atualizar_cartao(
    cartao_id: int,
    dados: CartaoAtualizar,
    sessao: Session = Depends(obter_sessao),
    autenticado=Depends(obter_usuario_atual),
):
    _, usuario_id = autenticado
    try:
        atualizado = repo.atualizar(
            sessao, cartao_id, usuario_id,
            nome=dados.nome, limite=dados.limite,
            dia_fechamento=dados.dia_fechamento, dia_vencimento=dados.dia_vencimento,
        )
    except FinTrackError as erro:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(erro))

    if atualizado is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Cartão não encontrado.")

    cartao = repo.buscar_por_id(sessao, cartao_id, usuario_id)
    return _para_schema(cartao_id, cartao)


@roteador.delete("/{cartao_id}", status_code=status.HTTP_204_NO_CONTENT)
def excluir_cartao(
    cartao_id: int,
    sessao: Session = Depends(obter_sessao),
    autenticado=Depends(obter_usuario_atual),
):
    _, usuario_id = autenticado
    if not repo.excluir(sessao, cartao_id, usuario_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Cartão não encontrado.")


@roteador.post("/{cartao_id}/compras", response_model=CartaoSaida, status_code=status.HTTP_201_CREATED)
def lancar_compra(
    cartao_id: int,
    dados: CompraCartaoEntrada,
    sessao: Session = Depends(obter_sessao),
    autenticado=Depends(obter_usuario_atual),
):
    _, usuario_id = autenticado
    try:
        repo.registrar_compra(sessao, cartao_id, usuario_id, dados.descricao, dados.valor, dados.parcelas)
    except FinTrackError as erro:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(erro))

    cartao = repo.buscar_por_id(sessao, cartao_id, usuario_id)
    return _para_schema(cartao_id, cartao)