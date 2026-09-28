from fintrack.modelos.conta import Conta
from fintrack.modelos.receita import Receita
from fintrack.modelos.despesa import Despesa


def main() -> None:
    conta = Conta("Seu Nome", saldo_inicial=500)
    conta.registrar(Receita("Salário", 3500))
    conta.registrar(Despesa("Aluguel", 1200))
    conta.registrar(Despesa("Supermercado", 450.75))
    print(conta.extrato())


if __name__ == "__main__":
    main()