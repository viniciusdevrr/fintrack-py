import os
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from passlib.context import CryptContext
from jose import jwt, JWTError

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

# CryptContext é a "calculadora" de hash. Indicamos bcrypt como o esquema usado.
_contexto_senha = CryptContext(schemes=["bcrypt"], deprecated="auto")


def gerar_hash_senha(senha: str) -> str:
    """Transforma uma senha em texto puro num hash seguro para salvar no banco."""
    return _contexto_senha.hash(senha)


def verificar_senha(senha_digitada: str, senha_hash: str) -> bool:
    """Confere se a senha digitada no login bate com o hash salvo."""
    return _contexto_senha.verify(senha_digitada, senha_hash)


def criar_token_acesso(usuario_id: int, email: str) -> str:
    """Gera um JWT contendo a identidade do usuário, válido por um tempo limitado."""
    expira_em = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": str(usuario_id),  # "sub" (subject) é o campo padrão do JWT para "dono do token"
        "email": email,
        "exp": expira_em,        # "exp" é o campo padrão que o JWT usa para expiração automática
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decodificar_token(token: str) -> dict | None:
    """Valida o token e devolve seu conteúdo. Se for inválido ou expirado, devolve None."""
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None