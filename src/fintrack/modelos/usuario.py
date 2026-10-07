import re
from fintrack.excecoes import DescricaoInvalidaError, FinTrackError


class EmailInvalidoError(FinTrackError):
    """Lançada quando o e-mail informado não tem um formato válido."""
    pass


class Usuario:
    """Representa a pessoa dona dos dados financeiros. A senha nunca é
    guardada aqui como texto puro — só o hash, calculado por fora (camada auth)."""

    _PADRAO_EMAIL = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

    def __init__(self, nome: str, email: str, senha_hash: str) -> None:
        self.nome = nome
        self.email = email
        self.__senha_hash = senha_hash

    @property
    def nome(self) -> str:
        return self.__nome

    @nome.setter
    def nome(self, valor: str) -> None:
        if not valor or not valor.strip():
            raise DescricaoInvalidaError("O nome não pode ser vazio.")
        self.__nome = valor.strip()

    @property
    def email(self) -> str:
        return self.__email

    @email.setter
    def email(self, valor: str) -> None:
        if not valor or not self._PADRAO_EMAIL.match(valor.strip()):
            raise EmailInvalidoError(f"E-mail inválido: {valor}")
        self.__email = valor.strip().lower()

    @property
    def senha_hash(self) -> str:
        return self.__senha_hash

    def __repr__(self) -> str:
        return f"Usuario({self.email})"