from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from fintrack.api.schemas import CartaoCriar, CartaoSaida, CartaoAtualizar, CompraCartaoEntrada
from fintrack.api.dependencias import obter_sessao, obter_usuario_atual
from fintrack.modelos.cartao import Cartao
from fintrack.repositorio import repositorio_cartao as repo
from fintrack.repositorio.modelos_orm import CartaoORM
from fintrack.servicos import servico_cartao
from fintrack.excecoes import FinTrackError

roteador = APIRouter(prefix="/cartoes", tags=["Cartões"])


def _para_schema(cartao_id: int, cartao: Cartao, registro: CartaoORM | None = None) -> CartaoSaida:
    status_info = servico_cartao.status_fatura(registro) if registro else {"fatura_fechada": False, "vencimento_proximo": False}
    return CartaoSaida(
        id=cartao_id, nome=cartao.nome, limite=cartao.limite,
        fatura_atual=cartao.fatura_atual, limite_disponivel=cartao.limite_disponivel,
        cor=cartao.cor,
        fatura_fechada=status_info["fatura_fechada"],
        vencimento_proximo=status_info["vencimento_proximo"],
    )

@roteador.get("/alertas/pendentes")
def tem_alertas_pendentes(sessao: Session = Depends(obter_sessao), autenticado=Depends(obter_usuario_atual)):
    """Usado pelo menu lateral: diz se existe algum cartão com vencimento próximo."""
    _, usuario_id = autenticado
    registros = sessao.query(CartaoORM).filter_by(usuario_id=usuario_id).all()
    algum_pendente = any(servico_cartao.status_fatura(r)["vencimento_proximo"] for r in registros)
    return {"tem_alerta": algum_pendente}

@roteador.post("", response_model=CartaoSaida, status_code=status.HTTP_201_CREATED)
def criar_cartao(dados: CartaoCriar, sessao: Session = Depends(obter_sessao), autenticado=Depends(obter_usuario_atual)):
    _, usuario_id = autenticado
    try:
        cartao = Cartao(dados.nome, dados.limite, dados.dia_fechamento, dados.dia_vencimento, dados.cor)
        cartao_id = repo.salvar(sessao, cartao, usuario_id)
    except FinTrackError as erro:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(erro))
    return _para_schema(cartao_id, cartao)


@roteador.get("", response_model=list[CartaoSaida])
def listar_cartoes(sessao: Session = Depends(obter_sessao), autenticado=Depends(obter_usuario_atual)):
    _, usuario_id = autenticado
    registros = sessao.query(CartaoORM).filter_by(usuario_id=usuario_id).all()
    resultado = []
    for r in registros:
        cartao = repo.buscar_por_id(sessao, r.id, usuario_id)
        resultado.append(_para_schema(r.id, cartao, r))
    return resultado


@roteador.put("/{cartao_id}", response_model=CartaoSaida)
def atualizar_cartao(cartao_id: int, dados: CartaoAtualizar, sessao: Session = Depends(obter_sessao), autenticado=Depends(obter_usuario_atual)):
    _, usuario_id = autenticado
    try:
        atualizado = repo.atualizar(sessao, cartao_id, usuario_id, dados.nome, dados.limite, dados.dia_fechamento, dados.dia_vencimento)
    except FinTrackError as erro:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(erro))
    if atualizado is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Cartão não encontrado.")
    registro = sessao.query(CartaoORM).filter_by(id=cartao_id, usuario_id=usuario_id).first()
    cartao = repo.buscar_por_id(sessao, cartao_id, usuario_id)
    return _para_schema(cartao_id, cartao, registro)


@roteador.delete("/{cartao_id}", status_code=status.HTTP_204_NO_CONTENT)
def excluir_cartao(cartao_id: int, sessao: Session = Depends(obter_sessao), autenticado=Depends(obter_usuario_atual)):
    _, usuario_id = autenticado
    if not repo.excluir(sessao, cartao_id, usuario_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Cartão não encontrado.")


@roteador.post("/{cartao_id}/compras", response_model=CartaoSaida, status_code=status.HTTP_201_CREATED)
def lancar_compra(cartao_id: int, dados: CompraCartaoEntrada, sessao: Session = Depends(obter_sessao), autenticado=Depends(obter_usuario_atual)):
    _, usuario_id = autenticado
    try:
        repo.registrar_compra(sessao, cartao_id, usuario_id, dados.descricao, dados.valor, dados.parcelas, dados.categoria_id)
    except FinTrackError as erro:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(erro))
    registro = sessao.query(CartaoORM).filter_by(id=cartao_id, usuario_id=usuario_id).first()
    cartao = repo.buscar_por_id(sessao, cartao_id, usuario_id)
    return _para_schema(cartao_id, cartao, registro)


@roteador.post("/{cartao_id}/pagar-fatura", response_model=CartaoSaida)
def pagar_fatura(cartao_id: int, sessao: Session = Depends(obter_sessao), autenticado=Depends(obter_usuario_atual)):
    _, usuario_id = autenticado
    if not servico_cartao.marcar_fatura_paga(sessao, cartao_id, usuario_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Cartão não encontrado.")
    registro = sessao.query(CartaoORM).filter_by(id=cartao_id, usuario_id=usuario_id).first()
    cartao = repo.buscar_por_id(sessao, cartao_id, usuario_id)
    return _para_schema(cartao_id, cartao, registro)


