from sqlalchemy.orm import Session
from fintrack.modelos.conta import Conta
from fintrack.modelos.receita import Receita
from fintrack.modelos.despesa import Despesa
from fintrack.modelos.despesa_cartao import DespesaCartao
from fintrack.modelos.cartao import Cartao
from .modelos_orm import ContaORM, ReceitaORM, DespesaORM, DespesaCartaoORM


def salvar_conta(sessao: Session, conta: Conta) -> int:
    """Salva a conta e todas as transações nela registradas, de uma vez."""
    registro_conta = ContaORM(titular=conta.titular, saldo_inicial=conta.saldo_inicial)
    sessao.add(registro_conta)
    sessao.commit()
    sessao.refresh(registro_conta)

    for transacao in conta.transacoes:
        _salvar_transacao(sessao, transacao, registro_conta.id)

    return registro_conta.id


def _salvar_transacao(sessao: Session, transacao, conta_id: int) -> None:
    dados_comuns = dict(
        descricao=transacao.descricao,
        valor=transacao.valor,
        data=transacao.data,
        conta_id=conta_id,
    )

    if isinstance(transacao, DespesaCartao):
        registro = DespesaCartaoORM(
            **dados_comuns,
            parcelas=transacao.parcelas,
            # cartao_id ficaria aqui depois que Cartao também tiver persistência própria ligada
        )
    elif isinstance(transacao, Despesa):
        registro = DespesaORM(**dados_comuns)
    elif isinstance(transacao, Receita):
        registro = ReceitaORM(**dados_comuns)
    else:
        raise TypeError(f"Tipo de transação não suportado para persistência: {type(transacao)}")

    sessao.add(registro)
    sessao.commit()


def carregar_conta(sessao: Session, conta_id: int) -> Conta | None:
    registro = sessao.get(ContaORM, conta_id)
    if registro is None:
        return None

    conta = Conta(registro.titular, registro.saldo_inicial)
    for t in registro.transacoes:
        conta.registrar(_transacao_para_dominio(t))
    return conta


def _transacao_para_dominio(registro):
    if isinstance(registro, ReceitaORM):
        return Receita(registro.descricao, registro.valor, registro.data)
    if isinstance(registro, DespesaORM):
        return Despesa(registro.descricao, registro.valor, registro.data)
    if isinstance(registro, DespesaCartaoORM):
        # Simplificação temporária: ainda não ligamos o cartão de verdade aqui.
        # Isso vai ser resolvido quando dermos persistência própria ao Cartao
        # vinculado (próxima iteração desta camada).
        cartao_provisorio = Cartao("Cartão", limite=999_999, dia_fechamento=1, dia_vencimento=10)
        return DespesaCartao(registro.descricao, registro.valor, cartao_provisorio, registro.parcelas or 1)
    raise TypeError(f"Registro de transação não reconhecido: {type(registro)}")