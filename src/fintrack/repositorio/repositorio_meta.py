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


def listar_todas(sessao: Session, usuario_id: int) -> list[tuple[int, Meta]]:
    registros = sessao.query(MetaORM).filter_by(usuario_id=usuario_id).all()
    return [(r.id, _para_dominio(r)) for r in registros]


def _para_dominio(registro: MetaORM) -> Meta:
    meta = Meta(registro.nome, registro.valor_alvo, registro.data_limite)
    if registro.valor_atual > 0:
        meta.aportar(registro.valor_atual)
    return meta


def buscar_por_id(sessao: Session, meta_id: int, usuario_id: int) -> Meta | None:
    registro = sessao.query(MetaORM).filter_by(id=meta_id, usuario_id=usuario_id).first()
    if registro is None:
        return None
    return _para_dominio(registro)


def atualizar(sessao: Session, meta_id: int, usuario_id: int, nome: str | None,
              valor_alvo: float | None, data_limite, data_limite_informada: bool) -> int | None:
    registro = sessao.query(MetaORM).filter_by(id=meta_id, usuario_id=usuario_id).first()
    if registro is None:
        return None

    Meta(nome or registro.nome, valor_alvo or registro.valor_alvo)  # valida

    if nome is not None:
        registro.nome = nome
    if valor_alvo is not None:
        registro.valor_alvo = valor_alvo
    if data_limite_informada:
        registro.data_limite = data_limite

    sessao.commit()
    return registro.id


def excluir(sessao: Session, meta_id: int, usuario_id: int) -> bool:
    registro = sessao.query(MetaORM).filter_by(id=meta_id, usuario_id=usuario_id).first()
    if registro is None:
        return False
    sessao.delete(registro)
    sessao.commit()
    return True


def aportar(sessao: Session, meta_id: int, usuario_id: int, valor: float) -> Meta | None:
    """Adiciona um valor ao progresso da meta, reconstruindo o objeto de
    domínio para reaproveitar a validação do método Meta.aportar()."""
    registro = sessao.query(MetaORM).filter_by(id=meta_id, usuario_id=usuario_id).first()
    if registro is None:
        return None

    meta = Meta(registro.nome, registro.valor_alvo, registro.data_limite)
    if registro.valor_atual > 0:
        meta.aportar(registro.valor_atual)  # restaura o progresso já existente
    meta.aportar(valor)  # aplica o novo aporte — valida valor > 0 automaticamente

    registro.valor_atual = meta.valor_atual
    sessao.commit()
    return meta