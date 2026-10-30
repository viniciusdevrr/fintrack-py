from sqlalchemy.orm import Session
from fintrack.modelos.usuario import Usuario
from fintrack.excecoes import FinTrackError
from .modelos_orm import UsuarioORM


class EmailJaCadastradoError(FinTrackError):
    """Lançada ao tentar cadastrar um e-mail que já existe no banco."""
    pass


def salvar(sessao: Session, usuario: Usuario) -> int:
    existente = sessao.query(UsuarioORM).filter_by(email=usuario.email).first()
    if existente is not None:
        raise EmailJaCadastradoError(f"Já existe uma conta com o e-mail {usuario.email}")

    registro = UsuarioORM(nome=usuario.nome, email=usuario.email, senha_hash=usuario.senha_hash)
    sessao.add(registro)
    sessao.commit()
    sessao.refresh(registro)
    return registro.id


def buscar_por_email(sessao: Session, email: str) -> Usuario | None:
    registro = sessao.query(UsuarioORM).filter_by(email=email.strip().lower()).first()
    if registro is None:
        return None
    return Usuario(registro.nome, registro.email, registro.senha_hash)


def buscar_por_id(sessao: Session, usuario_id: int) -> Usuario | None:
    registro = sessao.get(UsuarioORM, usuario_id)
    if registro is None:
        return None
    return Usuario(registro.nome, registro.email, registro.senha_hash)