from sqlalchemy.orm import Session
from fintrack.modelos.categoria import Categoria
from .modelos_orm import CategoriaORM


def salvar(sessao: Session, categoria: Categoria, usuario_id: int) -> int:
    registro = CategoriaORM(
        nome=categoria.nome,
        tipo=categoria.tipo,
        limite_mensal=categoria.limite_mensal,
        usuario_id=usuario_id,
    )
    sessao.add(registro)
    sessao.commit()
    sessao.refresh(registro)
    return registro.id


def buscar_por_id(sessao: Session, categoria_id: int, usuario_id: int) -> Categoria | None:
    registro = (
        sessao.query(CategoriaORM)
        .filter_by(id=categoria_id, usuario_id=usuario_id)
        .first()
    )
    if registro is None:
        return None
    return _para_dominio(registro)


def listar_todas(sessao: Session, usuario_id: int) -> list[Categoria]:
    registros = sessao.query(CategoriaORM).filter_by(usuario_id=usuario_id).all()
    return [_para_dominio(r) for r in registros]


def _para_dominio(registro: CategoriaORM) -> Categoria:
    return Categoria(registro.nome, registro.tipo, registro.limite_mensal)