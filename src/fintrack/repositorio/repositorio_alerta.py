from datetime import date
from sqlalchemy.orm import Session
from fintrack.modelos.alerta import Alerta
from .modelos_orm import AlertaORM


def ja_existe_alerta_do_mes(sessao: Session, usuario_id: int, categoria_id: int, referencia_mes: str) -> bool:
    """Evita duplicar o mesmo alerta de categoria no mesmo mês."""
    existente = (
        sessao.query(AlertaORM)
        .filter_by(usuario_id=usuario_id, categoria_id=categoria_id, referencia_mes=referencia_mes)
        .first()
    )
    return existente is not None


def salvar(sessao: Session, alerta: Alerta, usuario_id: int, categoria_id: int | None = None,
           referencia_mes: str | None = None) -> int:
    registro = AlertaORM(
        tipo=alerta.tipo,
        mensagem=alerta.mensagem,
        data=alerta.data,
        lido=alerta.lido,
        usuario_id=usuario_id,
        categoria_id=categoria_id,
        referencia_mes=referencia_mes,
    )
    sessao.add(registro)
    sessao.commit()
    sessao.refresh(registro)
    return registro.id


def listar_nao_lidos(sessao: Session, usuario_id: int) -> list[Alerta]:
    registros = (
        sessao.query(AlertaORM)
        .filter_by(usuario_id=usuario_id, lido=False)
        .order_by(AlertaORM.data.desc())
        .all()
    )
    return [_para_dominio(r) for r in registros]


def marcar_como_lido(sessao: Session, alerta_id: int, usuario_id: int) -> bool:
    registro = sessao.query(AlertaORM).filter_by(id=alerta_id, usuario_id=usuario_id).first()
    if registro is None:
        return False
    registro.lido = True
    sessao.commit()
    return True


def _para_dominio(registro: AlertaORM) -> Alerta:
    return Alerta(registro.tipo, registro.mensagem, registro.data, registro.lido)