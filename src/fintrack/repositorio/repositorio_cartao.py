from sqlalchemy.orm import Session
from fintrack.modelos.cartao import Cartao
from .modelos_orm import CartaoORM


def salvar(sessao: Session, cartao: Cartao) -> int:
    registro = CartaoORM(
        nome=cartao.nome,
        limite=cartao.limite,
        dia_fechamento=cartao.dia_fechamento,
        dia_vencimento=cartao.dia_vencimento,
    )
    sessao.add(registro)
    sessao.commit()
    sessao.refresh(registro)
    return registro.id


def listar_todos(sessao: Session) -> list[Cartao]:
    registros = sessao.query(CartaoORM).all()
    return [_para_dominio(r) for r in registros]


def _para_dominio(registro: CartaoORM) -> Cartao:
    return Cartao(registro.nome, registro.limite, registro.dia_fechamento, registro.dia_vencimento)