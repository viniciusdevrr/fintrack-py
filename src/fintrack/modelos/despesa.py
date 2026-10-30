from .transacao import Transacao


class Despesa(Transacao):
    @property
    def tipo(self) -> str:
        return "Despesa"

    def impacto_no_saldo(self) -> float:
        return -self.valor