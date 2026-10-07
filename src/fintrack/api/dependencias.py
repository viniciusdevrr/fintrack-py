from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from fintrack.database import SessionLocal
from fintrack.auth.seguranca import decodificar_token
from fintrack.repositorio import repositorio_usuario as repo_usuario


# Diz ao FastAPI onde fica o endpoint de login — usado só para gerar a
# documentação automática com o botão "Authorize".
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def obter_sessao():
    """Abre uma sessão de banco para a requisição e garante que ela
    sempre é fechada no final, mesmo se der erro no meio."""
    sessao = SessionLocal()
    try:
        yield sessao
    finally:
        sessao.close()


def obter_usuario_atual(
    token: str = Depends(oauth2_scheme),
    sessao: Session = Depends(obter_sessao),
):
    """Lê o token JWT enviado na requisição, valida e devolve o usuário dono dele.
    Qualquer rota que declare essa dependência passa a exigir login."""
    erro_nao_autorizado = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciais inválidas ou expiradas.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decodificar_token(token)
    if payload is None:
        raise erro_nao_autorizado

    usuario_id = payload.get("sub")
    if usuario_id is None:
        raise erro_nao_autorizado

    usuario = repo_usuario.buscar_por_id(sessao, int(usuario_id))
    if usuario is None:
        raise erro_nao_autorizado

    return usuario, int(usuario_id)