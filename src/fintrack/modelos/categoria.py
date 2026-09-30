from fintrack.excecoes import DescricaoInvalidaError, ValorInvalidoError, CategoriaInvalidaError


class Categoria:

    TIPOS_VALIDOS = ("receita", "despesa")

    def __init__(self, nome: str, tipo: str, limite_mensal: float | None = None) -> None:
        self.nome = nome
        self.tipo = tipo
        self.limite_mensal = limite_mensal

    @property
    def nome(self) -> str:
        return self.__nome

    @nome.setter
    def nome(self, valor: str) -> None:
        if not valor or not valor.strip():
            raise DescricaoInvalidaError("O nome da categoria não pode ser vazio.")
        self.__nome = valor.strip().capitalize()

    @property
    def tipo(self) -> str:
        return self.__tipo

    @tipo.setter
    def tipo(self, valor: str) -> None:
        if valor not in self.TIPOS_VALIDOS:
            raise CategoriaInvalidaError(f"Tipo inválido. Use um de: {self.TIPOS_VALIDOS}")
        self.__tipo = valor

    @property
    def limite_mensal(self) -> float | None:
        return self.__limite_mensal

    @limite_mensal.setter
    def limite_mensal(self, valor: float | None) -> None:
        if valor is not None and valor <= 0:
            raise ValorInvalidoError("O limite mensal deve ser maior que zero.")
        self.__limite_mensal = valor

    def __repr__(self) -> str:
        return f"Categoria({self.nome}, {self.tipo})"