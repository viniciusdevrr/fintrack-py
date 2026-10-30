from datetime import date
from sqlalchemy.orm import Session
from fintrack.modelos.cartao import Cartao
from fintrack.modelos.despesa_cartao import DespesaCartao
from fintrack.excecoes import FinTrackError
from .modelos_orm import CartaoORM, DespesaCartaoORM, ContaORM


def salvar(sessao: Session, cartao: Cartao, usuario_id: int) -> int:
    registro = CartaoORM(
        nome=cartao.nome, limite=cartao.limite,
        dia_fechamento=cartao.dia_fechamento, dia_vencimento=cartao.dia_vencimento,
        usuario_id=usuario_id, cor=cartao.cor,
    )
    sessao.add(registro)
    sessao.commit()
    sessao.refresh(registro)
    return registro.id


def listar_todos(sessao: Session, usuario_id: int) -> list[tuple[int, Cartao]]:
    registros = sessao.query(CartaoORM).filter_by(usuario_id=usuario_id).all()
    return [(r.id, _para_dominio_completo(sessao, r)) for r in registros]


def buscar_por_id(sessao: Session, cartao_id: int, usuario_id: int) -> Cartao | None:
    registro = sessao.query(CartaoORM).filter_by(id=cartao_id, usuario_id=usuario_id).first()
    if registro is None:
        return None
    return _para_dominio_completo(sessao, registro)


def atualizar(sessao: Session, cartao_id: int, usuario_id: int, nome: str | None,
              limite: float | None, dia_fechamento: int | None, dia_vencimento: int | None) -> int | None:
    registro = sessao.query(CartaoORM).filter_by(id=cartao_id, usuario_id=usuario_id).first()
    if registro is None:
        return None

    Cartao(
        nome or registro.nome,
        limite or registro.limite,
        dia_fechamento or registro.dia_fechamento,
        dia_vencimento or registro.dia_vencimento,
    )  # valida

    if nome is not None:
        registro.nome = nome
    if limite is not None:
        registro.limite = limite
    if dia_fechamento is not None:
        registro.dia_fechamento = dia_fechamento
    if dia_vencimento is not None:
        registro.dia_vencimento = dia_vencimento

    sessao.commit()
    return registro.id


def excluir(sessao: Session, cartao_id: int, usuario_id: int) -> bool:
    registro = sessao.query(CartaoORM).filter_by(id=cartao_id, usuario_id=usuario_id).first()
    if registro is None:
        return False
    sessao.delete(registro)
    sessao.commit()
    return True


def registrar_compra(sessao: Session, cartao_id: int, usuario_id: int,
                      descricao: str, valor: float, parcelas: int, categoria_id: int | None) -> int:
    cartao_registro = sessao.query(CartaoORM).filter_by(id=cartao_id, usuario_id=usuario_id).first()
    if cartao_registro is None:
        raise FinTrackError("Cartão não encontrado.")

    conta = sessao.query(ContaORM).filter_by(usuario_id=usuario_id).first()
    if conta is None:
        raise FinTrackError("Crie uma conta antes de lançar compras no cartão.")

    cartao_dominio = _para_dominio_completo(sessao, cartao_registro)
    nova_compra = DespesaCartao(descricao, valor, cartao_dominio, parcelas)
    cartao_dominio.registrar_compra(nova_compra)

    registro = DespesaCartaoORM(
        descricao=descricao, valor=valor, data=date.today(),
        conta_id=conta.id, cartao_id=cartao_id, parcelas=parcelas,
        categoria_id=categoria_id,
    )
    sessao.add(registro)
    sessao.commit()
    sessao.refresh(registro)
    return registro.id


def _para_dominio(registro: CartaoORM) -> Cartao:
    return Cartao(registro.nome, registro.limite, registro.dia_fechamento, registro.dia_vencimento, registro.cor)


def _para_dominio_completo(sessao: Session, registro: CartaoORM) -> Cartao:
    """Reconstrói o Cartao já carregando o histórico de compras, para que
    fatura_atual e limite_disponivel reflitam a realidade — não objetos vazios."""
    cartao = _para_dominio(registro)
    compras = (
        sessao.query(DespesaCartaoORM)
        .filter_by(cartao_id=registro.id)
        .order_by(DespesaCartaoORM.data)
        .all()
    )
    for c in compras:
        compra_dominio = DespesaCartao(c.descricao, c.valor, cartao, c.parcelas or 1)
        cartao.registrar_compra(compra_dominio)  # reaproveita a validação de limite
    return cartao