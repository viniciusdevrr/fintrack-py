class Cartao:
    """Representa um cartão de crédito e controla seu limite disponível."""

    def __init__(self, nome: str, limite: float, dia_fechamento: int, dia_vencimento: int) -> None:
        self.nome = nome
        self.limite = limite
        self.dia_fechamento = dia_fechamento
        self.dia_vencimento = dia_vencimento
        self.__compras: list["DespesaCartao"] = []

    @property
    def nome(self) -> str:
        return self.__nome

    @nome.setter
    def nome(self, valor: str) -> None:
        if not valor.strip():
            raise ValueError("O nome do cartão não pode ser vazio.")
        self.__nome = valor.strip()

    @property
    def limite(self) -> float:
        return self.__limite

    @limite.setter
    def limite(self, valor: float) -> None:
        if valor <= 0:
            raise ValueError("O limite deve ser maior que zero.")
        self.__limite = valor

    @property
    def dia_fechamento(self) -> int:
        return self.__dia_fechamento

    @dia_fechamento.setter
    def dia_fechamento(self, valor: int) -> None:
        if not 1 <= valor <= 28:
            raise ValueError("Dia de fechamento deve ser entre 1 e 28.")
        self.__dia_fechamento = valor

    @property
    def dia_vencimento(self) -> int:
        return self.__dia_vencimento

    @dia_vencimento.setter
    def dia_vencimento(self, valor: int) -> None:
        if not 1 <= valor <= 28:
            raise ValueError("Dia de vencimento deve ser entre 1 e 28.")
        self.__dia_vencimento = valor

    @property
    def compras(self) -> tuple["DespesaCartao", ...]:
        return tuple(self.__compras)

    @property
    def fatura_atual(self) -> float:
        """Soma o valor da parcela atual de cada compra em aberto no mês."""
        return sum(compra.valor_parcela for compra in self.__compras)

    @property
    def limite_disponivel(self) -> float:
        return self.__limite - sum(c.valor_total for c in self.__compras if not c.quitada)

    def registrar_compra(self, compra: "DespesaCartao") -> None:
        if compra.valor_total > self.limite_disponivel:
            raise ValueError("Limite do cartão insuficiente para essa compra.")
        self.__compras.append(compra)