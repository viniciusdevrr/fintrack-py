from datetime import date
from fintrack.excecoes import DescricaoInvalidaError


class Alerta:
    """Representa um aviso gerado pelo sistema, ex: limite de categoria estourado."""

    TIPOS_VALIDOS = ("limite_categoria", "fatura_cartao")

    def __init__(self, tipo: str, mensagem: str, data: date | None = None, lido: bool = False) -> None:
        self.tipo = tipo
        self.mensagem = mensagem
        self.__data = data or date.today()
        self.__lido = lido

    @property
    def tipo(self) -> str:
        return self.__tipo

    @tipo.setter
    def tipo(self, valor: str) -> None:
        if valor not in self.TIPOS_VALIDOS:
            raise ValueError(f"Tipo de alerta inválido. Use um de: {self.TIPOS_VALIDOS}")
        self.__tipo = valor

    @property
    def mensagem(self) -> str:
        return self.__mensagem

    @mensagem.setter
    def mensagem(self, valor: str) -> None:
        if not valor or not valor.strip():
            raise DescricaoInvalidaError("A mensagem do alerta não pode ser vazia.")
        self.__mensagem = valor.strip()

    @property
    def data(self) -> date:
        return self.__data

    @property
    def lido(self) -> bool:
        return self.__lido

    def marcar_como_lido(self) -> None:
        self.__lido = True

    def __str__(self) -> str:
        status = "✓ lido" if self.lido else "● novo"
        return f"[{status}] {self.mensagem}"