from .despesa import Despesa
from .cartao import Cartao
from fintrack.excecoes import TipoInvalidoError, ValorInvalidoError


class DespesaCartao(Despesa):

    def __init__(self, descricao: str, valor_total: float, cartao: Cartao, parcelas: int = 1) -> None:
        super().__init__(descricao, valor_total)
        self.cartao = cartao
        self.parcelas = parcelas
        self.__parcelas_pagas = 0

    @property
    def cartao(self) -> Cartao:
        return self.__cartao

    @cartao.setter
    def cartao(self, valor: Cartao) -> None:
        if not isinstance(valor, Cartao):
            raise TipoInvalidoError("cartao deve ser uma instância de Cartao.")
        self.__cartao = valor

    @property
    def parcelas(self) -> int:
        return self.__parcelas

    @parcelas.setter
    def parcelas(self, valor: int) -> None:
        if valor < 1:
            raise ValorInvalidoError("O número de parcelas deve ser no mínimo 1.")
        self.__parcelas = valor

    @property
    def valor_total(self) -> float:
        return self.valor

    @property
    def valor_parcela(self) -> float:
        return round(self.valor_total / self.parcelas, 2)

    @property
    def quitada(self) -> bool:
        return self.__parcelas_pagas >= self.parcelas

    def pagar_parcela(self) -> None:
        if self.quitada:
            raise ValueError("Essa compra já está totalmente quitada.")
        self.__parcelas_pagas += 1

    def impacto_no_saldo(self) -> float:
        return 0.0

    def tipo(self) -> str:
        return f"Cartão ({self.cartao.nome})"

    def __str__(self) -> str:
        return (f"{self.data:%d/%m/%Y} | {self.tipo:<20} | {self.descricao} | "
                f"{self.parcelas}x de R$ {self.valor_parcela:,.2f}")