from datetime import date
from pydantic import BaseModel, EmailStr, Field


# ---------- Usuário / Autenticação ----------

class UsuarioCriar(BaseModel):
    """O que a API espera receber no cadastro."""
    nome: str
    email: EmailStr  # Pydantic já valida formato de e-mail sozinho
    senha: str = Field(min_length=8)


class UsuarioSaida(BaseModel):
    """O que a API devolve sobre um usuário — repare que NÃO tem senha nem hash."""
    id: int
    nome: str
    email: str


class LoginEntrada(BaseModel):
    email: EmailStr
    senha: str


class TokenSaida(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ---------- Categoria ----------

class CategoriaCriar(BaseModel):
    nome: str
    tipo: str
    limite_mensal: float | None = None


class CategoriaSaida(BaseModel):
    id: int
    nome: str
    tipo: str
    limite_mensal: float | None


# ---------- Cartão ----------

class CartaoCriar(BaseModel):
    nome: str
    limite: float
    dia_fechamento: int = Field(ge=1, le=28)
    dia_vencimento: int = Field(ge=1, le=28)


class CartaoSaida(BaseModel):
    id: int
    nome: str
    limite: float
    fatura_atual: float
    limite_disponivel: float


# ---------- Meta ----------

class MetaCriar(BaseModel):
    nome: str
    valor_alvo: float
    data_limite: date | None = None


class MetaAportar(BaseModel):
    valor: float


class MetaSaida(BaseModel):
    id: int
    nome: str
    valor_alvo: float
    valor_atual: float
    progresso_percentual: float
    concluida: bool


# ---------- Conta / Transação ----------

class ContaCriar(BaseModel):
    titular: str
    saldo_inicial: float = 0.0


class TransacaoCriar(BaseModel):
    tipo: str  # "receita" ou "despesa"
    descricao: str
    valor: float


class ContaSaida(BaseModel):
    id: int
    titular: str
    saldo: float