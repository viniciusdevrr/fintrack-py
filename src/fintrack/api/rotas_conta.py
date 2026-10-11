from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from fintrack.api.schemas import ContaCriar, ContaSaida, TransacaoCriar, TransacaoSaida
from fintrack.api.dependencias import obter_sessao, obter_usuario_atual
from fintrack.repositorio import repositorio_conta as repo
from fintrack.excecoes import FinTrackError

roteador = APIRouter(prefix="/contas", tags=["Contas e Transações"])


@roteador.post("", response_model=ContaSaida, status_code=status.HTTP_201_CREATED)
def criar_conta(
    dados: ContaCriar,
    sessao: Session = Depends(obter_sessao),
    autenticado=Depends(obter_usuario_atual),
):
    _, usuario_id = autenticado

    if repo.buscar_conta_do_usuario(sessao, usuario_id) is not None:
        raise HTTPException(status.HTTP_409_CONFLICT, "Você já possui uma conta cadastrada.")

    conta_id = repo.criar_conta(sessao, dados.titular, dados.saldo_inicial, usuario_id)
    conta = repo.buscar_conta_do_usuario(sessao, usuario_id)
    return ContaSaida(id=conta.id, titular=conta.titular, saldo=conta.saldo_inicial)


@roteador.get("/minha", response_model=ContaSaida)
def ver_minha_conta(
    sessao: Session = Depends(obter_sessao),
    autenticado=Depends(obter_usuario_atual),
):
    _, usuario_id = autenticado
    conta = repo.buscar_conta_do_usuario(sessao, usuario_id)
    if conta is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Você ainda não tem uma conta cadastrada.")

    saldo = conta.saldo_inicial + sum(
        t.valor if t.tipo == "receita" else -t.valor for t in conta.transacoes
    )
    return ContaSaida(id=conta.id, titular=conta.titular, saldo=saldo)


@roteador.post("/minha/transacoes", response_model=TransacaoSaida, status_code=status.HTTP_201_CREATED)
def registrar_transacao(
    dados: TransacaoCriar,
    sessao: Session = Depends(obter_sessao),
    autenticado=Depends(obter_usuario_atual),
):
    _, usuario_id = autenticado
    conta = repo.buscar_conta_do_usuario(sessao, usuario_id)
    if conta is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Crie uma conta antes de registrar transações.")

    try:
        transacao_id = repo.registrar_transacao(
            sessao, conta.id, dados.tipo, dados.descricao, dados.valor, dados.categoria_id
        )
    except (FinTrackError, ValueError) as erro:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(erro))

    registro = next(t for t in conta.transacoes if t.id == transacao_id)
    return TransacaoSaida(
        id=registro.id, tipo=registro.tipo, descricao=registro.descricao,
        valor=registro.valor, data=registro.data, categoria_id=registro.categoria_id,
    )


@roteador.get("/minha/transacoes", response_model=list[TransacaoSaida])
def listar_minhas_transacoes(
    sessao: Session = Depends(obter_sessao),
    autenticado=Depends(obter_usuario_atual),
):
    _, usuario_id = autenticado
    conta = repo.buscar_conta_do_usuario(sessao, usuario_id)
    if conta is None:
        return []

    transacoes = repo.listar_transacoes(sessao, conta.id)
    return [
        TransacaoSaida(id=t.id, tipo=t.tipo, descricao=t.descricao, valor=t.valor,
                        data=t.data, categoria_id=t.categoria_id)
        for t in transacoes
    ]