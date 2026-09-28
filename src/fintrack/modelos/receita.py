from .transacao import Transacao


class Receita(Transacao):
    @property
    def tipo(self) -> str:
        return "Receita"

    def impacto_no_saldo(self) -> float:
        return self.valor
    