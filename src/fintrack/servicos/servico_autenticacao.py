from sqlalchemy.orm import Session
from fintrack.modelos.usuario import Usuario
from fintrack.repositorio import repositorio_usuario as repo
from fintrack.auth.seguranca import gerar_hash_senha, verificar_senha, criar_token_acesso
from fintrack.excecoes import FinTrackError


class CredenciaisInvalidasError(FinTrackError):
    """Lançada quando o e-mail não existe ou a senha não confere."""
    pass


def registrar(sessao: Session, nome: str, email: str, senha: str) -> int:
    """Cria um novo usuário: calcula o hash da senha e salva no banco."""
    senha_hash = gerar_hash_senha(senha)
    usuario = Usuario(nome, email, senha_hash)  # já valida nome/e-mail aqui
    return repo.salvar(sessao, usuario)


def login(sessao: Session, email: str, senha: str) -> str:
    """Confere e-mail e senha; se corretos, devolve um token JWT de acesso."""
    usuario = repo.buscar_por_email(sessao, email)
    if usuario is None or not verificar_senha(senha, usuario.senha_hash):
        raise CredenciaisInvalidasError("E-mail ou senha incorretos.")

    registro = sessao.query(repo.UsuarioORM).filter_by(email=usuario.email).first()
    return criar_token_acesso(registro.id, usuario.email)