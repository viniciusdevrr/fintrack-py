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


def listar_todas(sessao: Session, usuario_id: int) -> list[tuple[int, Categoria]]:
    registros = sessao.query(CategoriaORM).filter_by(usuario_id=usuario_id).all()
    return [(r.id, _para_dominio(r)) for r in registros]


def _para_dominio(registro: CategoriaORM) -> Categoria:
    return Categoria(registro.nome, registro.tipo, registro.limite_mensal)


def atualizar(sessao: Session, categoria_id: int, usuario_id: int, nome: str | None,
              tipo: str | None, limite_mensal: float | None, limite_informado: bool) -> int | None:
    registro = sessao.query(CategoriaORM).filter_by(id=categoria_id, usuario_id=usuario_id).first()
    if registro is None:
        return None

    # Usamos a classe de domínio só para validar os novos valores antes de gravar
    # (mesmo truque que já usamos no registro de transações: reaproveitar a
    # validação sem duplicar a regra).
    Categoria(
        nome or registro.nome,
        tipo or registro.tipo,
        limite_mensal if limite_informado else registro.limite_mensal,
    )

    if nome is not None:
        registro.nome = nome
    if tipo is not None:
        registro.tipo = tipo
    if limite_informado:
        registro.limite_mensal = limite_mensal

    sessao.commit()
    return registro.id


def excluir(sessao: Session, categoria_id: int, usuario_id: int) -> bool:
    registro = sessao.query(CategoriaORM).filter_by(id=categoria_id, usuario_id=usuario_id).first()
    if registro is None:
        return False
    sessao.delete(registro)
    sessao.commit()
    return True