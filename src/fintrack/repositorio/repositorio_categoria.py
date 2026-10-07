from sqlalchemy.orm import Session
from fintrack.modelos.categoria import Categoria
from .modelos_orm import CategoriaORM


def salvar(sessao: Session, categoria: Categoria) -> int:
    """Grava uma Categoria (objeto de domínio) no banco e devolve o id gerado."""
    registro = CategoriaORM(
        nome=categoria.nome,
        tipo=categoria.tipo,
        limite_mensal=categoria.limite_mensal,
    )
    sessao.add(registro)
    sessao.commit()
    sessao.refresh(registro)  # recarrega o registro para pegar o id gerado pelo banco
    return registro.id


def buscar_por_id(sessao: Session, categoria_id: int) -> Categoria | None:
    registro = sessao.get(CategoriaORM, categoria_id)
    if registro is None:
        return None
    return _para_dominio(registro)


def listar_todas(sessao: Session) -> list[Categoria]:
    registros = sessao.query(CategoriaORM).all()
    return [_para_dominio(r) for r in registros]


def _para_dominio(registro: CategoriaORM) -> Categoria:
    """Converte uma linha do banco (ORM) de volta num objeto Categoria de verdade,
    com todas as validações da classe de domínio."""
    return Categoria(registro.nome, registro.tipo, registro.limite_mensal)