from datetime import date
from sqlalchemy.orm import Session
from fintrack.modelos.conta import Conta
from fintrack.modelos.receita import Receita
from fintrack.modelos.despesa import Despesa
from fintrack.modelos.despesa_cartao import DespesaCartao
from fintrack.modelos.cartao import Cartao
from .modelos_orm import ContaORM, ReceitaORM, DespesaORM, DespesaCartaoORM


def criar_conta(sessao: Session, titular: str, saldo_inicial: float, usuario_id: int) -> int:
    registro = ContaORM(titular=titular, saldo_inicial=saldo_inicial, usuario_id=usuario_id)
    sessao.add(registro)
    sessao.commit()
    sessao.refresh(registro)
    return registro.id


def buscar_conta_do_usuario(sessao: Session, usuario_id: int) -> ContaORM | None:
    """Por enquanto cada usuário tem uma única conta principal."""
    return sessao.query(ContaORM).filter_by(usuario_id=usuario_id).first()


def registrar_transacao(sessao: Session, conta_id: int, tipo: str, descricao: str,
                         valor: float, categoria_id: int | None) -> int:
    from fintrack.modelos.receita import Receita
    from fintrack.modelos.despesa import Despesa

    # Reaproveita as classes de domínio só para validar (descrição vazia,
    # valor negativo etc.) antes de gravar no banco — a validação não muda
    # dependendo de onde o dado entra.
    if tipo == "receita":
        Receita(descricao, valor)
        registro = ReceitaORM(descricao=descricao, valor=valor, data=date.today(),
                               conta_id=conta_id, categoria_id=categoria_id)
    elif tipo == "despesa":
        Despesa(descricao, valor)
        registro = DespesaORM(descricao=descricao, valor=valor, data=date.today(),
                               conta_id=conta_id, categoria_id=categoria_id)
    else:
        raise ValueError("Tipo de transação deve ser 'receita' ou 'despesa'.")

    sessao.add(registro)
    sessao.commit()
    sessao.refresh(registro)
    return registro.id


def listar_transacoes(sessao: Session, conta_id: int) -> list:
    from .modelos_orm import TransacaoORM
    return (
        sessao.query(TransacaoORM)
        .filter_by(conta_id=conta_id)
        .order_by(TransacaoORM.data.desc())
        .all()
    )

def salvar_conta(sessao: Session, conta: Conta, usuario_id: int) -> int:
    """Salva a conta (vinculada a um usuário dono) e suas transações."""
    registro_conta = ContaORM(
        titular=conta.titular,
        saldo_inicial=conta.saldo_inicial,
        usuario_id=usuario_id,
    )
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