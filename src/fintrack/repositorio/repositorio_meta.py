from sqlalchemy.orm import Session
from fintrack.modelos.meta import Meta
from .modelos_orm import MetaORM


def salvar(sessao: Session, meta: Meta, usuario_id: int) -> int:
    registro = MetaORM(
        nome=meta.nome,
        valor_alvo=meta.valor_alvo,
        valor_atual=meta.valor_atual,
        data_limite=meta.data_limite,
        usuario_id=usuario_id,
    )
    sessao.add(registro)
    sessao.commit()
    sessao.refresh(registro)
    return registro.id


def listar_todas(sessao: Session, usuario_id: int) -> list[Meta]:
    registros = sessao.query(MetaORM).filter_by(usuario_id=usuario_id).all()
    return [_para_dominio(r) for r in registros]


def _para_dominio(registro: MetaORM) -> Meta:
    meta = Meta(registro.nome, registro.valor_alvo, registro.data_limite)
    if registro.valor_atual > 0:
        meta.aportar(registro.valor_atual)
    return meta