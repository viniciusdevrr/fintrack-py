from abc import ABC, abstractmethod
from datetime import date


class Transacao(ABC):

    def __init__(self, descricao: str, valor: float, data: date | None = None) -> None:
        self.descricao = descricao
        self.valor = valor
        self.__data = data or date.today

    @property
    def descricao(self) -> str:
        return self.__descricao

    @descricao.setter
    def descricao(self, nova: str) -> None:
        if not nova or not nova.strip():
            raise ValueError("A descrição não pode ser vazia.")
        self.__descricao = nova.strip()

    @property
    def valor(self) -> float:
        return self.__valor

    @valor.setter
    def valor(self, novo: float) -> None:
        if novo <= 0:
            raise ValueError("O valor deve ser maior que zero.")
        self.__valor = float(novo)

    @property
    def data(self) -> date:
        return self.__data

