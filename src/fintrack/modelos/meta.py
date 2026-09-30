from datetime import date
from fintrack.excecoes import DescricaoInvalidaError, ValorInvalidoError


class Meta:
    """Representa um objetivo financeiro, ex: Viagem, Reserva de emergência."""

    def __init__(self, nome: str, valor_alvo: float, data_limite: date | None = None) -> None:
        self.nome = nome
        self.valor_alvo = valor_alvo
        self.data_limite = data_limite
        self.__valor_atual = 0.0

    @property
    def nome(self) -> str:
        return self.__nome

    @nome.setter
    def nome(self, valor: str) -> None:
        if not valor.strip():
            raise ValueError("O nome da meta não pode ser vazio.")
        self.__nome = valor.strip()

    @property
    def valor_alvo(self) -> float:
        return self.__valor_alvo

    @valor_alvo.setter
    def valor_alvo(self, valor: float) -> None:
        if valor <= 0:
            raise ValueError("O valor alvo deve ser maior que zero.")
        self.__valor_alvo = valor

    @property
    def valor_atual(self) -> float:
        return self.__valor_atual

    @property
    def progresso_percentual(self) -> float:
        return min(100.0, round((self.__valor_atual / self.__valor_alvo) * 100, 1))

    @property
    def concluida(self) -> bool:
        return self.__valor_atual >= self.__valor_alvo

    def aportar(self, valor: float) -> None:
        """Adiciona dinheiro à meta (um depósito)."""
        if valor <= 0:
            raise ValorInvalidoError("O valor do aporte deve ser maior que zero.")
        self.__valor_atual += valor

    def __str__(self) -> str:
        status = "✅ concluída" if self.concluida else f"{self.progresso_percentual}%"
        return f"{self.nome}: R$ {self.valor_atual:,.2f} / R$ {self.valor_alvo:,.2f} ({status})"