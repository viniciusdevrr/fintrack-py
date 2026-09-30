from .transacao import Transacao
from fintrack.excecoes import TipoInvalidoError


class Conta:
    def __init__(self, titular: str, saldo_inicial: float = 0.0) -> None:
        self.__titular = titular
        self.__saldo_inicial = saldo_inicial
        self.__transacoes: list[Transacao] = []

    @property
    def titular(self) -> str:
        return self.__titular

    @property
    def saldo(self) -> float:
        return self.__saldo_inicial + sum(t.impacto_no_saldo() for t in self.__transacoes)

    @property
    def transacoes(self) -> tuple[Transacao, ...]:
        return tuple(self.__transacoes)

    def registrar(self, transacao: Transacao) -> None:
        if not isinstance(transacao, Transacao):
            raise TipoInvalidoError("Só é possível registrar objetos do tipo Transacao.")
        self.__transacoes.append(transacao)

    def extrato(self) -> str:
        linhas = [f"Extrato de {self.titular}", "-" * 50]
        linhas += [str(t) for t in self.__transacoes]
        linhas += ["-" * 50, f"Saldo atual: R$ {self.saldo:,.2f}"]
        return "\n".join(linhas)